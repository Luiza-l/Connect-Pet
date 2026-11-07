export interface CoordenadasPublicas {
  latitude: number;
  longitude: number;
}

export interface LocalizacaoOng {
  ponto: CoordenadasPublicas | null;
  publica: boolean;
  confirmada: boolean;
  cep: string;
  enderecoPrivado: string;
}

export function criarLocalizacaoOng(): LocalizacaoOng {
  return { ponto: null, publica: false, confirmada: false, cep: "", enderecoPrivado: "" };
}

export function coordenadasValidas(ponto: CoordenadasPublicas | null): ponto is CoordenadasPublicas {
  return ponto !== null && Number.isFinite(ponto.latitude) && Number.isFinite(ponto.longitude)
    && Math.abs(ponto.latitude) <= 90 && Math.abs(ponto.longitude) <= 180;
}

export function validarLocalizacaoOng(localizacao: LocalizacaoOng): string | null {
  if (localizacao.cep && !/^\d{5}-?\d{3}$/.test(localizacao.cep)) return "Informe um CEP com 8 dígitos ou deixe o campo vazio.";
  if (localizacao.ponto && !coordenadasValidas(localizacao.ponto)) return "O ponto selecionado é inválido.";
  if (localizacao.publica && (!coordenadasValidas(localizacao.ponto) || !localizacao.confirmada)) {
    return "Visualize e confirme o ponto aproximado antes de autorizar sua exibição no mapa.";
  }
  return null;
}

/** Distância em linha reta; não representa um trajeto ou endereço exato. */
export function calcularDistanciaKm(origem: CoordenadasPublicas, destino: CoordenadasPublicas): number {
  const radianos = (graus: number) => graus * Math.PI / 180;
  const parcela = Math.sin(radianos(destino.latitude - origem.latitude) / 2) ** 2
    + Math.cos(radianos(origem.latitude)) * Math.cos(radianos(destino.latitude))
    * Math.sin(radianos(destino.longitude - origem.longitude) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, parcela)));
}
