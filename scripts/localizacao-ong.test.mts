import test from "node:test";
import assert from "node:assert/strict";
import { calcularDistanciaKm, coordenadasValidas, criarLocalizacaoOng, validarLocalizacaoOng } from "../src/lib/localizacaoOng.ts";

test("mapa é opcional e a autorização exige um ponto confirmado", () => {
  const localizacao = criarLocalizacaoOng();
  assert.equal(validarLocalizacaoOng(localizacao), null);
  localizacao.publica = true;
  assert.ok(validarLocalizacaoOng(localizacao));
  localizacao.ponto = { latitude: -23.55, longitude: -46.63 };
  assert.ok(validarLocalizacaoOng(localizacao));
  localizacao.confirmada = true;
  assert.equal(validarLocalizacaoOng(localizacao), null);
  localizacao.cep = "123";
  assert.ok(validarLocalizacaoOng(localizacao));
});

test("coordenadas inválidas não são publicadas e distâncias são aproximadas em km", () => {
  assert.equal(coordenadasValidas({ latitude: NaN, longitude: 0 }), false);
  assert.equal(coordenadasValidas({ latitude: 91, longitude: 0 }), false);
  assert.equal(coordenadasValidas({ latitude: 0, longitude: Infinity }), false);
  assert.equal(calcularDistanciaKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 }), 0);
  assert.ok(Math.abs(calcularDistanciaKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }) - 111.195) < 0.01);
});
