import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

test("chat por anúncio recupera histórico, confirma leitura e restringe operações aos participantes", async () => {
  const sql = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
  const banco = new PGlite();
  const [ong, adotante, outroAdotante, outraOng, pet, segundoPet, terceiroPet] = Array.from({ length: 7 }, () => randomUUID());
  const mensagem = randomUUID();
  async function assumir(usuario: string) {
    await banco.query("select set_config('request.jwt.claim.sub', $1, false)", [usuario]);
  }
  async function abrir(animal: string) {
    return (await banco.query<{ id: string }>("select public.abrir_conversa_pet($1) as id", [animal])).rows[0].id;
  }
  const caixa = async () => (await banco.query<{ id: string; nao_lida: boolean; ultima_mensagem: string; nome_pet: string }>(
    "select * from public.caixa_conversas_pet order by atividade_em desc")).rows;
  const enviar = (id: string, conversa: string, texto: string) =>
    banco.query("insert into public.mensagens_pet(id, conversa_id, conteudo) values ($1,$2,$3)", [id, conversa, texto]);
  try {
    const definicaoPet = sql.slice(sql.indexOf("create table if not exists public.pets ("), sql.indexOf("-- Índices para otimização de busca"));
    await banco.exec(`
      create role anon; create role authenticated; create schema auth;
      create publication supabase_realtime;
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
      grant usage on schema auth to authenticated;
      create table public.profiles(id uuid primary key, role text, name text);
      alter table public.profiles enable row level security;
      create policy proprio on public.profiles for select to authenticated using(id=auth.uid());
      ${definicaoPet}
      ${sql.slice(sql.indexOf("-- 3. Tabela de Candidaturas"), sql.indexOf("-- 5. Tabela de Perfis"))}
      alter table public.applications enable row level security;
      alter table public.application_messages enable row level security;
      ${sql.slice(sql.indexOf('drop policy if exists "Allow participants to view applications"'), sql.indexOf("-- 8. Documentação"))}
      grant select, insert on public.applications, public.application_messages to authenticated;
      grant select on public.pets, public.profiles to authenticated;
    `);
    const migracao = sql.slice(sql.indexOf("-- 15. Conversas sobre anúncios"), sql.indexOf("-- 16. Notificações"));
    await banco.exec(migracao);
    await banco.exec(migracao);
    const notificacoes = sql.slice(sql.indexOf("-- 16. Notificações"));
    await banco.exec(notificacoes);
    await banco.exec(notificacoes);
    const avisos = async () => (await banco.query("select tipo from public.avisos_guardiao order by tipo")).rows;
    const publicadas = await banco.query("select tablename from pg_publication_tables where pubname='supabase_realtime' order by tablename");
    assert.deepEqual(publicadas.rows, [{ tablename: "conversas_pet" }, { tablename: "mensagens_pet" }]);
    for (const [id, papel] of [[ong, "guardian"], [outraOng, "guardian"], [adotante, "adopter"], [outroAdotante, "adopter"]]) {
      await banco.query("insert into public.profiles values ($1,$2,$3)", [id, papel, papel]);
    }
    for (const [id, dono] of [[pet, ong], [segundoPet, ong], [terceiroPet, outraOng]]) {
      await banco.query(`insert into public.pets (id, name, species, breed, size, approximate_age, age_category,
        sex, guardian_id, guardian_name, guardian_type) values ($1,'Lua','cat','SRD','small','2 anos','adult','female',$2,'Abrigo','ngo')`, [id, dono]);
    }
    await banco.exec("set role anon");
    await assert.rejects(abrir(pet), /permission denied/);
    await assert.rejects(caixa(), /permission denied/);
    await banco.exec("reset role; set role authenticated");
    await assumir(adotante);
    const candidatura = randomUUID();
    await banco.query(`insert into applications(id,pet_id,guardian_id,candidate_id,candidate_name,candidate_email,candidate)
      values ($1,$2,$3,$4,'Adotante','teste@example.invalid',jsonb_build_object('id',$4::text))`, [candidatura,pet,ong,adotante]);
    await banco.query(`insert into application_messages(application_id,sender_id,sender_name,sender_role,message)
      values ($1,$2,'Adotante','candidate','Olá')`, [candidatura,adotante]);
    assert.deepEqual(await avisos(), []);
    const conversa = await abrir(pet);
    assert.equal(await abrir(pet), conversa);
    const segunda = await abrir(segundoPet);
    assert.notEqual(segunda, conversa);
    assert.equal((await caixa()).length, 2);
    await enviar(mensagem, conversa, "Posso visitar?");
    await assert.rejects(enviar(mensagem, conversa, "Posso visitar?"), /duplicate key/);
    await assert.rejects(enviar(randomUUID(), conversa, "  "), /check constraint/);
    await assert.rejects(banco.query("update public.mensagens_pet set conteudo='alterado'"), /permission denied/);
    assert.equal((await caixa())[0].nao_lida, false);
    await assumir(outraOng);
    assert.deepEqual(await avisos(), []);
    assert.equal((await banco.query("update application_messages set vista_pelo_guardiao=true returning id")).rows.length, 0);
    assert.deepEqual(await caixa(), []);
    assert.equal((await banco.query("select id from public.mensagens_pet")).rows.length, 0);
    await assert.rejects(enviar(randomUUID(), conversa, "Teste"), /row-level security/);
    await assert.rejects(abrir(pet));
    await assumir(outroAdotante);
    assert.deepEqual(await caixa(), []);
    assert.notEqual(await abrir(pet), conversa);
    await assert.rejects(banco.query("insert into public.conversas_pet(pet_id,responsavel_id) values ($1,$2)", [pet, outraOng]), /permission denied/);
    const outra = await abrir(terceiroPet);
    await assumir(ong);
    assert.deepEqual(await avisos(), [{ tipo: "candidatura" }, { tipo: "conversa" }]);
    await banco.query("update applications set vista_pelo_guardiao=true where id=$1", [candidatura]);
    assert.deepEqual(await avisos(), [{ tipo: "conversa" }, { tipo: "mensagem_candidatura" }]);
    await banco.query("update application_messages set vista_pelo_guardiao=true where application_id=$1", [candidatura]);
    assert.ok(!(await caixa()).some(c => c.id === outra));
    assert.equal((await caixa()).find(c => c.id === conversa)?.nao_lida, true);
    await banco.query("update public.mensagens_pet set lida=true where id=$1", [mensagem]);
    assert.equal((await caixa()).find(c => c.id === conversa)?.nao_lida, false);
    assert.deepEqual(await avisos(), []);
    await enviar(randomUUID(), conversa, "Claro!");
    await assumir(adotante);
    const resumo = (await caixa())[0];
    assert.equal(resumo.id, conversa);
    assert.equal(resumo.ultima_mensagem, "Claro!");
    assert.equal(resumo.nao_lida, true);
    assert.deepEqual((await banco.query("select conteudo from public.mensagens_pet where conversa_id=$1 order by enviada_em", [conversa])).rows,
      [{ conteudo: "Posso visitar?" }, { conteudo: "Claro!" }]);
    assert.equal((await banco.query("select id from public.mensagens_pet where conversa_id=$1", [segunda])).rows.length, 0);
    await banco.exec("reset role");
    await banco.query("delete from public.pets where id=$1", [pet]);
    await banco.exec("set role authenticated");
    assert.equal((await caixa()).find(c => c.id === conversa)?.nome_pet, "Lua");
  } finally {
    await banco.close();
  }
});
