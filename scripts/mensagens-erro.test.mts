import assert from "node:assert/strict";
import test from "node:test";
import { obterMensagemErro } from "../src/lib/mensagensErro.ts";

test("traduz erros comuns de autenticação sem expor o texto do serviço", () => {
  assert.equal(obterMensagemErro({ code: "invalid_credentials", message: "Invalid login credentials" }, "login"), "E-mail ou senha incorretos.");
  assert.match(obterMensagemErro({ code: "email_not_confirmed" }, "login"), /Confirme seu e-mail/);
  assert.match(obterMensagemErro({ code: "over_request_rate_limit" }, "login"), /Aguarde alguns minutos/);
});

test("preserva orientações específicas para cadastro, senha e envio de fotos", () => {
  assert.match(obterMensagemErro({ code: "user_already_exists" }, "cadastro"), /já está cadastrado/);
  assert.match(obterMensagemErro({ code: "weak_password" }, "redefinicao"), /senha/);
  assert.match(obterMensagemErro({ code: "bucket_not_found", message: "bucket not found: pet-photos" }, "uploadFoto"), /temporariamente indisponível/);
});

test("oculta mensagens desconhecidas e orienta a pessoa a tentar novamente", () => {
  const mensagemTecnica = "Falha SQL: tabela private.profiles token-secreto";
  assert.equal(obterMensagemErro({ message: mensagemTecnica }, "pet"), "Não foi possível salvar os dados do animal. Confira sua conexão e tente novamente.");
  assert.equal(obterMensagemErro({ message: mensagemTecnica }, "generico").includes(mensagemTecnica), false);
});
