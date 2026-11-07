import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const esquema = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const extrair = (inicio: string, fim: string) => {
  const posicao = esquema.indexOf(inicio);
  assert.ok(posicao >= 0, `Bloco SQL ausente: ${inicio}`);
  const limite = esquema.indexOf(fim, posicao);
  assert.ok(limite > posicao, `Fim do bloco SQL ausente: ${fim}`);
  return esquema.slice(posicao, limite);
};

test("migração do mapa protege endereços, respeita RLS e revoga consentimento", async () => {
  const banco = new PGlite();
  try {
    await banco.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as
        $$ select jsonb_build_object('role', current_setting('request.jwt.claim.role', true)) $$;
      grant usage on schema auth to anon, authenticated;
      grant execute on function auth.uid(), auth.jwt() to anon, authenticated;
      ${extrair("create table if not exists public.profiles (", "-- Garantir que colunas recentes")}
      create table public.pets (id text primary key, guardian_id text, status text);
      alter table public.profiles enable row level security;
      ${extrair("-- Políticas para Profiles", "-- Políticas para Favorites")}
      ${extrair("create or replace function public.profiles_antes_de_gravar()", "-- 10.8 ")}
      grant select, insert, update on public.profiles to authenticated;
      insert into auth.users values ('11111111-1111-4111-8111-111111111111', 'legado@teste.invalid', '{}');
      insert into public.profiles (id, role, guardian_type, name, email, city, state)
      values ('11111111-1111-4111-8111-111111111111', 'guardian', 'ngo', 'ONG antiga', 'legado@teste.invalid', 'Campinas', 'SP');
    `);
    const migracao = esquema.slice(esquema.indexOf("-- 14. Mapa de ONGs"));
    await banco.exec(migracao);
    await banco.exec(migracao);
    await banco.exec(`
      insert into auth.users values ('22222222-2222-4222-8222-222222222222', 'publica@teste.invalid',
        '{"role":"guardian","guardianType":"ngo","name":"ONG pública","city":"Campinas","state":"SP","latitudePublica":-22.9,"longitudePublica":-47.06,"localizacaoPublica":true,"cep":"13000-000","enderecoPrivado":"Endereço sigiloso"}');
      insert into auth.users values ('33333333-3333-4333-8333-333333333333', 'privada@teste.invalid',
        '{"role":"guardian","guardianType":"ngo","name":"ONG privada","city":"Campinas","state":"SP","latitudePublica":-22.91,"longitudePublica":-47.07}');
      insert into auth.users values ('44444444-4444-4444-8444-444444444444', 'adotante@teste.invalid', '{"role":"adopter","name":"Adotante"}');
      insert into public.pets values
        ('disponivel', '22222222-2222-4222-8222-222222222222', 'available'),
        ('em-processo', '22222222-2222-4222-8222-222222222222', 'in_process'),
        ('adotado', '22222222-2222-4222-8222-222222222222', 'adopted');
      set role anon;
    `);
    const publico = await banco.query<{ id: string; pets_disponiveis: number }>("select * from public.listar_ongs_no_mapa()");
    assert.equal(publico.rows.length, 1);
    assert.equal(Number(publico.rows[0].pets_disponiveis), 1);
    assert.deepEqual(Object.keys(publico.rows[0]).sort(), ["id", "nome", "cidade", "estado", "descricao", "avatar", "latitude", "longitude", "pets_disponiveis"].sort());
    await assert.rejects(banco.query("select endereco_privado from public.profiles"), /permission denied/);
    await banco.exec(`reset role; set role authenticated; set request.jwt.claim.role = 'authenticated'; set request.jwt.claim.sub = '33333333-3333-4333-8333-333333333333';`);
    const tentativa = await banco.query("update public.profiles set localizacao_publica = false where id = '22222222-2222-4222-8222-222222222222' returning id");
    assert.equal(tentativa.rows.length, 0);
    assert.equal((await banco.query("select * from public.listar_ongs_no_mapa()")).rows.length, 1);
    await banco.exec("set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222'; update public.profiles set localizacao_publica = false where id = auth.uid();");
    assert.equal((await banco.query("select * from public.listar_ongs_no_mapa()")).rows.length, 0);
    await banco.exec("update public.profiles set localizacao_publica = true where id = auth.uid(); update public.profiles set city = 'São Paulo' where id = auth.uid();");
    assert.equal((await banco.query("select * from public.listar_ongs_no_mapa()")).rows.length, 0);
    await assert.rejects(banco.query("update public.profiles set latitude_publica = 100, longitude_publica = 0 where id = auth.uid()"), /profiles_ponto_publico_valido/);
    await banco.exec("set request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';");
    await assert.rejects(banco.query("update public.profiles set localizacao_publica = true, latitude_publica = 0, longitude_publica = 0 where id = auth.uid()"), /profiles_consentimento_mapa/);
    await banco.exec("reset role;");
    const legado = await banco.query<{ localizacao_publica: boolean; latitude_publica: number | null }>("select localizacao_publica, latitude_publica from public.profiles where id = '11111111-1111-4111-8111-111111111111'");
    assert.deepEqual(legado.rows[0], { localizacao_publica: false, latitude_publica: null });
  } finally {
    await banco.close();
  }
});
