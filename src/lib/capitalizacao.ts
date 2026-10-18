const PARTICULAS_NOME = new Set([
  "a", "ao", "aos", "com", "da", "das", "de", "do", "dos", "e", "em",
  "na", "nas", "no", "nos", "para", "por", "sem",
]);

const SIGLAS_CONHECIDAS = new Set([
  "CEO", "CFO", "CNPJ", "CPF", "CRM", "CTO", "EPP", "LTDA", "MEI", "OAB",
  "ONG", "OSC", "OSCIP", "PJ", "RH", "S/A", "TI", "UI", "UX",
]);

function temLetra(valor: string): boolean {
  return /\p{L}/u.test(valor);
}

function ehTextoTodoMaiusculo(valor: string): boolean {
  return temLetra(valor)
    && valor === valor.toLocaleUpperCase("pt-BR")
    && valor !== valor.toLocaleLowerCase("pt-BR");
}

function capitalizarParteNome(parte: string, textoTodoMaiusculo: boolean): string {
  if (!temLetra(parte)) return parte;

  const parteMaiuscula = parte.toLocaleUpperCase("pt-BR");
  if (SIGLAS_CONHECIDAS.has(parteMaiuscula)
    || /^(?:[IVXLCDM]+)$/u.test(parte)
    || /^(?:\p{Lu}\.){2,}$/u.test(parte)) {
    return parteMaiuscula;
  }

  const temMinuscula = /\p{Ll}/u.test(parte);
  const temMaiuscula = /\p{Lu}/u.test(parte);
  if (!textoTodoMaiusculo && parte === parteMaiuscula && parte.length >= 2 && parte.length <= 4) {
    return parte;
  }
  if (!textoTodoMaiusculo && temMinuscula && temMaiuscula) {
    return parte;
  }

  const minuscula = parte.toLocaleLowerCase("pt-BR");
  return minuscula.replace(/^\p{L}/u, (letra) => letra.toLocaleUpperCase("pt-BR"));
}

function capitalizarPalavraNome(palavra: string, textoTodoMaiusculo: boolean): string {
  return palavra
    .split(/([-’'])/u)
    .map((parte, indice) => indice % 2 === 0 ? capitalizarParteNome(parte, textoTodoMaiusculo) : parte)
    .join("");
}

/**
 * Padroniza nomes sem destruir siglas conhecidas, algarismos romanos ou grafias em camel case.
 */
  export function capitalizarNomeProprio(valor: string): string {
  const texto = valor.trim().replace(/\s+/g, " ");
  if (!texto) return "";

  const textoTodoMaiusculo = ehTextoTodoMaiusculo(texto);
  return texto
    .split(" ")
    .map((palavra, indice) => {
      const palavraMinuscula = palavra.toLocaleLowerCase("pt-BR");
      if (indice > 0 && PARTICULAS_NOME.has(palavraMinuscula)) return palavraMinuscula;
      if (indice > 0 && /^d['’]\p{L}/u.test(palavraMinuscula)) {
        return `d${palavra[1]}${capitalizarPalavraNome(palavra.slice(2), textoTodoMaiusculo)}`;
      }
      return capitalizarPalavraNome(palavra, textoTodoMaiusculo);
    })
    .join(" ");
}

function protegerEnderecos(texto: string): { textoProtegido: string; valores: string[] } {
  const valores: string[] = [];
  const padrao = /(?:https?:\/\/|www\.)\S+|[\w.+-]+@[\w.-]+\.\p{L}{2,}|@[a-zA-Z0-9._-]{2,30}/giu;
  const textoProtegido = texto.replace(padrao, (valor) => {
    const pontuacaoFinal = valor.match(/[.,!?;:]+$/u)?.[0] || "";
    const endereco = pontuacaoFinal ? valor.slice(0, -pontuacaoFinal.length) : valor;
    const indice = valores.push(endereco) - 1;
    return `\uE000${indice}\uE001${pontuacaoFinal}`;
  });
  return { textoProtegido, valores };
}

/**
 * Capitaliza o início do texto, de novos parágrafos e de frases após ponto, sem
 * alterar o restante da grafia nem endereços que dependem de caixa exata.
 */
export function capitalizarFrases(valor: string): string {
  const texto = valor
    .trim()
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n");
  if (!texto) return "";

  const { textoProtegido, valores } = protegerEnderecos(texto);
  const capitalizado = textoProtegido.replace(
    /(^|[.!?](?:["'”’\)\]]*)\s+|\n+\s*)(["'“‘\(\[]*)(\p{Ll})/gmu,
    (_trecho, separador: string, abertura: string, letra: string) =>
      `${separador}${abertura}${letra.toLocaleUpperCase("pt-BR")}`,
  );

  return capitalizado.replace(/\uE000(\d+)\uE001/gu, (_marcador, indice: string) => valores[Number(indice)] || "");
}
