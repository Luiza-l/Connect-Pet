import test from "node:test";
import assert from "node:assert/strict";
import {
  encontrarMunicipioOficial,
  normalizarNomeLocalidade,
} from "../src/lib/localidadesIbge.ts";
import {
  validateFullName,
  validateIntegerRange,
  validateOrganizationName,
  validateSocialProfile,
} from "../src/lib/validation.ts";
import {
  interpretarIdadePet,
  validarDescricoesPet,
  validarIdadePersistidaPet,
  validarIdadePet,
  validarNomePet,
} from "../src/lib/validacaoPet.ts";
import { capitalizarFrases, capitalizarNomeProprio } from "../src/lib/capitalizacao.ts";

test("reconhece município oficial apesar de acentos e espaços", () => {
  const municipios = [
    { id: 3550308, nome: "São Paulo" },
    { id: 3509502, nome: "Campinas" },
  ];

  assert.equal(normalizarNomeLocalidade("  SÃO   PAULO "), "sao paulo");
  assert.deepEqual(encontrarMunicipioOficial("sao paulo", municipios), municipios[0]);
  assert.equal(encontrarMunicipioOficial("Curitiba", municipios), undefined);
});

test("idade do animal aceita apenas inteiro com unidade e deriva a faixa", () => {
  assert.deepEqual(validarIdadePet("banana", "anos"), {
    valida: false,
    erro: "Informe uma idade inteira entre 1 e 30 anos.",
  });
  assert.deepEqual(validarIdadePet("2", "anos"), {
    valida: true,
    idadeAproximada: "2 anos",
    categoria: "young",
  });
  assert.deepEqual(validarIdadePet("1", "anos"), {
    valida: true,
    idadeAproximada: "1 ano",
    categoria: "young",
  });
  assert.deepEqual(validarIdadePet("3", "anos"), {
    valida: true,
    idadeAproximada: "3 anos",
    categoria: "adult",
  });
  assert.deepEqual(interpretarIdadePet("7 meses"), { valor: "7", unidade: "meses" });
  assert.equal(validarIdadePersistidaPet("2 anos", "adult"), "A faixa etária não corresponde à idade aproximada informada.");
});

test("nome completo rejeita números e aceita caracteres do português", () => {
  assert.equal(validateFullName("Maria d'Ávila").valid, true);
  assert.equal(validateFullName("Maria 123").valid, false);
});

test("nomes de organização e de pet permitem formatos reais sem aceitar ruído", () => {
  assert.equal(validateOrganizationName("Instituto 4 Patas & Amor").valid, true);
  assert.equal(validateOrganizationName("@@@").valid, false);
  assert.equal(validarNomePet("R2-D2"), null);
  assert.notEqual(validarNomePet("123"), null);
});

test("perfil social e quantidades têm validação de formato e limites", () => {
  assert.equal(validateSocialProfile("@maria.silva").valid, true);
  assert.equal(validateSocialProfile("instagram.com/maria").valid, true);
  assert.equal(validateSocialProfile("qualquer texto").valid, false);
  assert.equal(validateIntegerRange(2, 1, 20, "Adultos").valid, true);
  assert.equal(validateIntegerRange(2.5, 1, 20, "Adultos").valid, false);
  assert.equal(validateIntegerRange(21, 1, 20, "Adultos").valid, false);
});

test("história do animal é opcional, mas é validada quando preenchida", () => {
  assert.equal(validarDescricoesPet("Amigo para toda hora", "", "Dócil e sociável."), null);
  assert.equal(
    validarDescricoesPet("Amigo para toda hora", "Texto curto", "Dócil e sociável."),
    "Quando preenchida, a história do animal deve ter ao menos 20 caracteres.",
  );
});

test("capitaliza nomes próprios preservando partículas, siglas e exceções", () => {
  assert.equal(capitalizarNomeProprio("rex"), "Rex");
  assert.equal(capitalizarNomeProprio("MARIA DA SILVA"), "Maria da Silva");
  assert.equal(capitalizarNomeProprio("ONG AMOR ANIMAL LTDA"), "ONG Amor Animal LTDA");
  assert.equal(capitalizarNomeProprio("Instituto AMAR"), "Instituto AMAR");
  assert.equal(capitalizarNomeProprio("Ana Clara d'ávila"), "Ana Clara d'Ávila");
  assert.equal(capitalizarNomeProprio("iFood Pet"), "iFood Pet");
});

test("capitaliza frases sem modificar endereços, siglas ou a caixa interna", () => {
  assert.equal(
    capitalizarFrases("rex é dócil. convive bem com crianças! também gosta da ONG."),
    "Rex é dócil. Convive bem com crianças! Também gosta da ONG.",
  );
  assert.equal(
    capitalizarFrases("acesse https://exemplo.com/pets. depois envie para contato@exemplo.com."),
    "Acesse https://exemplo.com/pets. Depois envie para contato@exemplo.com.",
  );
});
