type ContextoErro =
  | "login"
  | "cadastro"
  | "recuperacao"
  | "redefinicao"
  | "perfil"
  | "pet"
  | "exclusaoPet"
  | "favorito"
  | "uploadFoto"
  | "mensagem"
  | "candidatura"
  | "generico";

type ErroEstruturado = {
  code?: unknown;
  status?: unknown;
  statusCode?: unknown;
  message?: unknown;
  name?: unknown;
};

const mensagensPorCodigo: Record<string, Partial<Record<ContextoErro, string>>> = {
  invalid_credentials: { login: "E-mail ou senha incorretos." },
  email_not_confirmed: { login: "Confirme seu e-mail antes de entrar. Confira sua caixa de entrada." },
  over_email_send_rate_limit: {
    cadastro: "Muitos e-mails foram solicitados. Aguarde alguns minutos antes de tentar novamente.",
    recuperacao: "Muitos pedidos foram feitos. Aguarde alguns minutos antes de solicitar outro e-mail.",
  },
  over_request_rate_limit: {
    login: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
    cadastro: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
    recuperacao: "Muitos pedidos foram feitos. Aguarde alguns minutos antes de solicitar outro e-mail.",
  },
  user_already_exists: { cadastro: "Este e-mail já está cadastrado. Tente entrar na sua conta." },
  email_address_invalid: { cadastro: "Este endereço de e-mail não pode ser usado. Confira se foi digitado corretamente." },
  weak_password: {
    cadastro: "A senha não atende aos critérios de segurança. Escolha outra senha mais forte.",
    redefinicao: "A senha não atende aos critérios de segurança. Escolha outra senha mais forte.",
  },
  same_password: { redefinicao: "Escolha uma senha diferente da atual." },
  session_not_found: { redefinicao: "O link de redefinição expirou ou já foi usado. Solicite um novo link." },
  otp_expired: { redefinicao: "O link de redefinição expirou ou já foi usado. Solicite um novo link." },
  bucket_not_found: { uploadFoto: "O envio de fotos está temporariamente indisponível. Tente novamente mais tarde." },
  not_found: { uploadFoto: "A foto não foi encontrada. Selecione o arquivo novamente." },
  storage_object_not_found: { uploadFoto: "A foto não foi encontrada. Selecione o arquivo novamente." },
  unauthorized: { uploadFoto: "Sua sessão expirou. Entre novamente para enviar fotos." },
  unauthenticated: { uploadFoto: "Sua sessão expirou. Entre novamente para enviar fotos." },
  "42501": { uploadFoto: "Sua conta não tem acesso ao envio de fotos. Entre novamente e tente de novo." },
  http_413: { uploadFoto: "A foto é muito grande. Escolha um arquivo menor." },
};

const mensagensPadrao: Record<ContextoErro, string> = {
  login: "Não foi possível entrar agora. Confira seus dados e tente novamente.",
  cadastro: "Não foi possível concluir o cadastro. Confira os dados e tente novamente.",
  recuperacao: "Não foi possível enviar as instruções. Aguarde um pouco e tente novamente.",
  redefinicao: "Não foi possível atualizar a senha. Tente novamente ou solicite um novo link.",
  perfil: "Não foi possível salvar as alterações do perfil. Confira sua conexão e tente novamente.",
  pet: "Não foi possível salvar os dados do animal. Confira sua conexão e tente novamente.",
  exclusaoPet: "Não foi possível remover o animal. Tente novamente em instantes.",
  favorito: "Não foi possível atualizar seus favoritos. Confira sua conexão e tente novamente.",
  uploadFoto: "Não foi possível enviar a foto. Confira sua conexão e tente novamente.",
  mensagem: "Não foi possível enviar a mensagem. Tente novamente em instantes.",
  candidatura: "Não foi possível enviar a candidatura. Confira sua conexão e tente novamente.",
  generico: "Ocorreu um erro inesperado. Tente novamente em instantes.",
};

/** Traduz erros conhecidos e mantém detalhes técnicos fora das mensagens exibidas. */
export function obterMensagemErro(erro: unknown, contexto: ContextoErro): string {
  const detalhe = erro && typeof erro === "object" ? erro as ErroEstruturado : {};
  const codigo = typeof detalhe.code === "string" ? detalhe.code.toLowerCase() : "";
  const status = Number(detalhe.status ?? detalhe.statusCode);

  if (codigo && mensagensPorCodigo[codigo]?.[contexto]) {
    return mensagensPorCodigo[codigo][contexto]!;
  }
  if (status === 401 || status === 403) {
    if (contexto === "uploadFoto") return "Sua sessão expirou ou não permite enviar fotos. Entre novamente e tente de novo.";
    if (contexto === "login") return mensagensPadrao.login;
  }
  if (status === 429) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  }
  if (detalhe.name === "FetchError" || (erro instanceof TypeError && /fetch|network/i.test(erro.message))) {
    return "Não foi possível conectar ao serviço. Verifique sua internet e tente novamente.";
  }
  return mensagensPadrao[contexto];
}

/** Registra somente metadados do erro, sem conteúdo de requisições ou dados pessoais. */
export function registrarErroSeguro(operacao: string, erro: unknown): void {
  const detalhe = erro && typeof erro === "object" ? erro as ErroEstruturado : {};
  console.warn(operacao, {
    codigo: typeof detalhe.code === "string" ? detalhe.code : undefined,
    status: typeof detalhe.status === "number" ? detalhe.status : undefined,
    tipo: typeof detalhe.name === "string" ? detalhe.name : undefined,
  });
}
