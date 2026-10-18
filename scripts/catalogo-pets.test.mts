import test from "node:test";
import assert from "node:assert/strict";
import { obterPetsDoCatalogo } from "../src/lib/catalogoPets.ts";

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
