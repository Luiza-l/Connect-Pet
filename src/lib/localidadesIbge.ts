const URL_LOCALIDADES_IBGE = "https://servicodados.ibge.gov.br/api/v1/localidades";
const TEMPO_LIMITE_REQUISICAO_MS = 10_000;

export interface EstadoIbge {
  id: number;
  nome: string;
  sigla: string;
}

export interface MunicipioIbge {
  id: number;
  nome: string;
}

let consultaEstados: Promise<EstadoIbge[]> | null = null;
const consultasMunicipios = new Map<string, Promise<MunicipioIbge[]>>();

async function consultarApiIbge<T>(caminho: string): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_REQUISICAO_MS);

  try {
    const resposta = await fetch(`${URL_LOCALIDADES_IBGE}${caminho}`, {
      headers: { Accept: "application/json" },
      signal: controlador.signal,
    });
    if (!resposta.ok) {
      throw new Error(`O IBGE respondeu com o status ${resposta.status}.`);
    }
    return await resposta.json() as T;
  } finally {
    clearTimeout(temporizador);
  }
}

export function obterEstadosIbge(): Promise<EstadoIbge[]> {
  if (!consultaEstados) {
    consultaEstados = consultarApiIbge<EstadoIbge[]>("/estados?orderBy=nome")
      .then((estados) => estados.filter((estado) => estado.sigla && estado.nome))
      .catch((erro) => {
        consultaEstados = null;
        throw erro;
      });
  }
  return consultaEstados;
}

export function obterMunicipiosIbge(uf: string): Promise<MunicipioIbge[]> {
  const sigla = uf.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(sigla)) return Promise.resolve([]);

  const consultaExistente = consultasMunicipios.get(sigla);
  if (consultaExistente) return consultaExistente;

  const consulta = consultarApiIbge<MunicipioIbge[]>(`/estados/${encodeURIComponent(sigla)}/municipios?orderBy=nome`)
    .then((municipios) => municipios.filter((municipio) => municipio.nome))
    .catch((erro) => {
      consultasMunicipios.delete(sigla);
      throw erro;
    });
  consultasMunicipios.set(sigla, consulta);
  return consulta;
}

export function normalizarNomeLocalidade(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

export function encontrarMunicipioOficial(
  cidade: string,
  municipios: readonly MunicipioIbge[],
): MunicipioIbge | undefined {
  const cidadeNormalizada = normalizarNomeLocalidade(cidade);
  if (!cidadeNormalizada) return undefined;
  return municipios.find((municipio) => normalizarNomeLocalidade(municipio.nome) === cidadeNormalizada);
}

export async function validarLocalidadeIbge(
  estado: string,
  cidade: string,
): Promise<{ valida: true; estado: string; cidade: string } | { valida: false; erro: string }> {
  const sigla = estado.trim().toUpperCase();
  if (!sigla || !cidade.trim()) {
    return { valida: false, erro: "Selecione o estado e o município." };
  }

  try {
    const estados = await obterEstadosIbge();
    if (!estados.some((item) => item.sigla === sigla)) {
      return { valida: false, erro: "Selecione uma unidade federativa válida." };
    }

    const municipios = await obterMunicipiosIbge(sigla);
    const municipio = encontrarMunicipioOficial(cidade, municipios);
    if (!municipio) {
      return { valida: false, erro: "Selecione um município válido para o estado informado." };
    }

    return { valida: true, estado: sigla, cidade: municipio.nome };
  } catch {
    return {
      valida: false,
      erro: "Não foi possível validar a localidade com o IBGE. Verifique sua conexão e tente novamente.",
    };
  }
}
