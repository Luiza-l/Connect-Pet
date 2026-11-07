import { createClient } from "@/lib/client";
import { obterUrlImagemPermitida } from "@/lib/origensImagem";
import type { CoordenadasPublicas } from "@/lib/localizacaoOng";
import { coordenadasValidas } from "@/lib/localizacaoOng";
import { normalizarNomeLocalidade, obterEstadosIbge } from "@/lib/localidadesIbge";

export interface OngNoMapa extends CoordenadasPublicas {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  descricao: string | null;
  avatar: string | null;
  petsDisponiveis: number;
}

export async function obterOngsNoMapa(sinal?: AbortSignal): Promise<OngNoMapa[]> {
  const ongs: OngNoMapa[] = [];
  const limite = AbortSignal.timeout(15_000);
  const sinalConsulta = sinal ? AbortSignal.any([sinal, limite]) : limite;
  // Pagina explicitamente para não omitir organizações pelo limite do PostgREST.
  for (let inicio = 0; ; inicio += 500) {
    const consulta = createClient().rpc("listar_ongs_no_mapa").order("id").range(inicio, inicio + 499).abortSignal(sinalConsulta);
    const { data, error } = await consulta;
    if (error) throw new Error("Não foi possível carregar as ONGs. Tente novamente em instantes.");
    if (!Array.isArray(data)) throw new Error("A consulta de ONGs retornou um resultado inesperado.");
    for (const linha of data) {
      const ponto = { latitude: Number(linha.latitude), longitude: Number(linha.longitude) };
      if (linha.latitude === null || linha.longitude === null || !coordenadasValidas(ponto)) continue;
      ongs.push({
        ...ponto, id: String(linha.id), nome: String(linha.nome), cidade: String(linha.cidade),
        estado: String(linha.estado), descricao: typeof linha.descricao === "string" ? linha.descricao : null,
        avatar: obterUrlImagemPermitida(linha.avatar), petsDisponiveis: Number(linha.pets_disponiveis) || 0,
      });
    }
    if (data.length < 500) return ongs;
  }
}

const consultasMunicipios = new Map<string, Promise<CoordenadasPublicas>>();

/** Busca somente a sede municipal. Endereço e CEP privados nunca são enviados ao geocodificador. */
export async function geocodificarMunicipio(cidade: string, uf: string): Promise<CoordenadasPublicas> {
  const chave = `${uf}:${normalizarNomeLocalidade(cidade)}`;
  const existente = consultasMunicipios.get(chave);
  if (existente) return existente;
  const consulta = (async () => {
    const estados = await obterEstadosIbge();
    const estado = estados.find((item) => item.sigla === uf);
    if (!estado || !cidade.trim()) throw new Error("Selecione o estado e o município primeiro.");
    const url = new URL(process.env.NEXT_PUBLIC_GEOCODIFICADOR_URL || "https://photon.komoot.io/api/");
    url.searchParams.set("q", `${cidade}, ${estado.nome}, Brasil`);
    url.searchParams.set("limit", "5");
    const resposta = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!resposta.ok) throw new Error("O serviço de localização está indisponível. Tente novamente depois.");
    const dados = await resposta.json();
    const candidatos = Array.isArray(dados.features) ? dados.features : [];
    const municipio = candidatos.find((item: { properties?: Record<string, string>; geometry?: { type?: string } }) => {
      const propriedades = item.properties;
      return propriedades && propriedades.countrycode?.toUpperCase() === "BR"
        && normalizarNomeLocalidade(propriedades.name || "") === normalizarNomeLocalidade(cidade)
        && normalizarNomeLocalidade(propriedades.state || "") === normalizarNomeLocalidade(estado.nome)
        && propriedades.osm_key === "place" && item.geometry?.type === "Point";
    });
    const coordenadas = municipio?.geometry?.coordinates;
    const ponto = { latitude: coordenadas?.[1], longitude: coordenadas?.[0] };
    if (!coordenadasValidas(ponto)) throw new Error("Não encontramos o centro deste município. Tente novamente ou selecione uma região diretamente no mapa.");
    return ponto;
  })().catch((erro: unknown) => {
    consultasMunicipios.delete(chave);
    throw erro;
  });
  consultasMunicipios.set(chave, consulta);
  return consulta;
}
