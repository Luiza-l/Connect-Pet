import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("decisões respeitam as permissões e o status anterior, registrando cada mudança uma vez", async () => {
  const esquema = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
  function trecho(inicio: string, fim: string) {
    const posicao = esquema.indexOf(inicio);
    const limite = esquema.indexOf(fim, posicao);
    assert.ok(posicao >= 0 && limite > posicao);
    return esquema.slice(posicao, limite);
  }
  const banco = new PGlite();
  const ong = randomUUID(), outraOng = randomUUID(), adotante = randomUUID();
  const pet = randomUUID(), candidatura = randomUUID();
  const assumir = (id: string) => banco.query("select set_config('teste.usuario', $1, false)", [id]);
  const decidir = async (anterior: string, novo: string) => (await banco.query(
    "update applications set status=$1 where id=$2 and status=$3 returning status", [novo, candidatura, anterior],
  )).rows;
  try {
    await banco.exec(`
      create role authenticated;
      create schema auth;
      create function auth.uid() returns uuid language sql stable as $$ select current_setting('teste.usuario')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
      grant usage on schema auth to authenticated;
      create table profiles(id uuid primary key, role text);
      create table pets(id uuid primary key, guardian_id text, status text);
      ${trecho("create table if not exists public.applications (", "-- Índices para otimização de busca na tabela applications")}
      ${trecho("create table if not exists public.application_messages (", "-- Índice para busca de mensagens por candidatura")}
      alter table applications enable row level security;
      ${trecho('create policy "Allow participants to view applications"', "-- Políticas para Mensagens de Candidatura")}
      ${trecho("create or replace function public.applications_validar_transicao_status()", "-- Corrige pets de candidaturas")}
      grant select on profiles, pets, applications, application_messages to authenticated;
      grant update(status) on applications to authenticated;
    `);
    await banco.query("insert into profiles values ($1,'guardian'),($2,'guardian'),($3,'adopter')", [ong, outraOng, adotante]);
    await banco.query("insert into pets values ($1,$2,'in_process')", [pet, ong]);
    await banco.query(`insert into applications(id,pet_id,guardian_id,candidate_id,candidate_name,candidate_email)
      values ($1,$2,$3,$4,'Adotante','teste@example.invalid')`, [candidatura, pet, ong, adotante]);
    await banco.exec("set role authenticated");
    for (const usuario of [adotante, outraOng]) {
      await assumir(usuario);
      assert.deepEqual(await decidir("pending", "approved"), []);
    }
    await assumir(ong);
    await assert.rejects(decidir("pending", "completed"), /Transição de status inválida/);
    assert.deepEqual(await decidir("pending", "approved"), [{ status: "approved" }]);
    assert.deepEqual(await decidir("pending", "rejected"), []);
    assert.deepEqual(await decidir("pending", "approved"), []);
    assert.equal((await banco.query("select message from application_messages")).rows.length, 1);
    assert.deepEqual(await decidir("approved", "completed"), [{ status: "completed" }]);
    assert.deepEqual((await banco.query("select status from pets")).rows, [{ status: "adopted" }]);
    await decidir("completed", "under_review");
    await decidir("under_review", "pending");
    assert.deepEqual(await decidir("pending", "rejected"), [{ status: "rejected" }]);
    assert.deepEqual(await decidir("pending", "approved"), []);
    assert.deepEqual((await banco.query("select status from pets")).rows, [{ status: "available" }]);
    assert.equal((await banco.query("select message from application_messages")).rows.length, 5);
  } finally {
    await banco.close();
  }
});
