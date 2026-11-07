import test from "node:test";
import assert from "node:assert/strict";
import { filtrarPetsDaOng, obterPetsDoCatalogo } from "../src/lib/catalogoPets.ts";

test("remove animais adotados do catálogo sem apagar o cadastro", () => {
  const animais = [
    { id: "disponivel", status: "available" as const },
    { id: "em-processo", status: "in_process" as const },
    { id: "adotado", status: "adopted" as const },
  ];

  const catalogo = obterPetsDoCatalogo(animais);

  assert.deepEqual(catalogo.map((animal) => animal.id), ["disponivel", "em-processo"]);
  assert.equal(animais.length, 3);
});

test("recoloca o animal no catálogo quando o status volta a disponível", () => {
  const animal = { id: "reativado", status: "adopted" as "adopted" | "available" };

  assert.equal(obterPetsDoCatalogo([animal]).length, 0);

  animal.status = "available";

  assert.deepEqual(obterPetsDoCatalogo([animal]), [animal]);
});

test("filtro de ONG mantém somente os vínculos reais com status disponível", () => {
  const idOng = "11111111-1111-4111-8111-111111111111";
  const pets = [
    { id: "disponivel", guardianId: idOng, guardianType: "ngo" as const, status: "available" as const },
    { id: "em-processo", guardianId: idOng, guardianType: "ngo" as const, status: "in_process" as const },
    { id: "adotado", guardianId: idOng, guardianType: "ngo" as const, status: "adopted" as const },
    { id: "outra-ong", guardianId: "22222222-2222-4222-8222-222222222222", guardianType: "ngo" as const, status: "available" as const },
    { id: "individual", guardianId: idOng, guardianType: "individual" as const, status: "available" as const },
  ];
  assert.deepEqual(filtrarPetsDaOng(pets, idOng).map((pet) => pet.id), ["disponivel"]);
  assert.deepEqual(filtrarPetsDaOng(pets, "invalido"), []);
  assert.deepEqual(filtrarPetsDaOng(pets, ""), []);
  assert.deepEqual(filtrarPetsDaOng(pets, "33333333-3333-4333-8333-333333333333"), []);
  assert.deepEqual(filtrarPetsDaOng(pets, null), pets);
});
