import type { Pet, PetAgeCategory } from "@/types";

export type UnidadeIdadePet = "semanas" | "meses" | "anos";

export const TEMPERAMENTOS_PREDEFINIDOS = [
  "Afetuoso",
  "Brincalhão",
  "Calmo",
  "Dócil",
  "Energético",
  "Independente",
  "Protetor",
  "Sociável",
  "Tímido",
] as const;

export const RACAS_POR_ESPECIE: Record<Pet["species"], readonly string[]> = {
  dog: [
    "Sem raça definida (SRD)",
    "Beagle",
    "Border Collie",
    "Bulldog Francês",
    "Chihuahua",
    "Dachshund",
    "Golden Retriever",
    "Labrador Retriever",
    "Lhasa Apso",
    "Pastor Alemão",
    "Pinscher",
    "Pit Bull",
    "Poodle",
    "Rottweiler",
    "Shih-tzu",
    "Yorkshire Terrier",
  ],
  cat: [
    "Sem raça definida (SRD)",
    "Angorá",
    "Bengal",
    "Maine Coon",
    "Persa",
    "Ragdoll",
    "Siamês",
    "Sphynx",
  ],
};

export const ROTULOS_FAIXA_ETARIA: Record<PetAgeCategory, string> = {
  puppy: "Filhote",
  young: "Jovem",
  adult: "Adulto",
  senior: "Idoso",
};

function obterMesesAproximados(valor: number, unidade: UnidadeIdadePet): number {
  if (unidade === "semanas") return valor / 4.345;
  if (unidade === "anos") return valor * 12;
  return valor;
}

export function obterFaixaEtariaPet(mesesAproximados: number): PetAgeCategory {
  if (mesesAproximados < 12) return "puppy";
  if (mesesAproximados < 36) return "young";
  if (mesesAproximados < 96) return "adult";
  return "senior";
}

function obterLimiteIdade(unidade: UnidadeIdadePet): number {
  if (unidade === "semanas") return 52;
  if (unidade === "meses") return 359;
  return 30;
}

export function validarIdadePet(
  valorInformado: string,
  unidade: UnidadeIdadePet,
): { valida: true; idadeAproximada: string; categoria: PetAgeCategory } | { valida: false; erro: string } {
  const valor = Number(valorInformado);
  const limite = obterLimiteIdade(unidade);
  if (!Number.isInteger(valor) || valor < 1 || valor > limite) {
    return { valida: false, erro: `Informe uma idade inteira entre 1 e ${limite} ${unidade}.` };
  }

  const rotuloUnidade = unidade === "semanas"
    ? (valor === 1 ? "semana" : "semanas")
    : unidade === "meses"
      ? (valor === 1 ? "mês" : "meses")
      : (valor === 1 ? "ano" : "anos");

  return {
    valida: true,
    idadeAproximada: `${valor} ${rotuloUnidade}`,
    categoria: obterFaixaEtariaPet(obterMesesAproximados(valor, unidade)),
  };
}

export function interpretarIdadePet(idadeAproximada?: string): { valor: string; unidade: UnidadeIdadePet } {
  const correspondencia = idadeAproximada?.trim().match(/^(\d+)\s+(semana|semanas|mês|meses|ano|anos)$/i);
  if (!correspondencia) return { valor: "", unidade: "anos" };

  const unidadeOriginal = correspondencia[2].toLocaleLowerCase("pt-BR");
  const unidade: UnidadeIdadePet = unidadeOriginal.startsWith("semana")
    ? "semanas"
    : unidadeOriginal === "mês" || unidadeOriginal === "meses"
      ? "meses"
      : "anos";
  return { valor: correspondencia[1], unidade };
}

export function validarNomePet(nome: string): string | null {
  const texto = nome.trim();
  if (texto.length < 2 || texto.length > 50) return "O nome do animal deve ter entre 2 e 50 caracteres.";
  if (!/[\p{L}]/u.test(texto) || !/^[\p{L}\p{M}\p{N}\s'’.-]+$/u.test(texto)) {
    return "O nome do animal deve conter letras e não pode incluir símbolos incomuns.";
  }
  return null;
}

export function validarRacaPet(raca: string): string | null {
  const texto = raca.trim();
  if (texto.length < 2 || texto.length > 50 || !/[\p{L}]/u.test(texto)) {
    return "Selecione uma raça ou informe um nome de raça válido.";
  }
  return null;
}

export function validarTemperamentos(temperamentos: readonly string[]): string | null {
  if (temperamentos.length === 0) return "Selecione ao menos uma característica de temperamento.";
  if (temperamentos.length > 6) return "Selecione no máximo seis características de temperamento.";
  return null;
}

export function validarDescricoesPet(
  destaque: string,
  historia: string,
  descricaoTemperamento: string,
): string | null {
  const destaqueNormalizado = destaque.trim();
  const historiaNormalizada = historia.trim();
  const descricaoNormalizada = descricaoTemperamento.trim();

  if (destaqueNormalizado.length < 5 || destaqueNormalizado.length > 120) {
    return "A frase de destaque deve ter entre 5 e 120 caracteres.";
  }
  if (historiaNormalizada && historiaNormalizada.length < 20) {
    return "Quando preenchida, a história do animal deve ter ao menos 20 caracteres.";
  }
  if (historiaNormalizada.length > 1000) {
    return "A história do animal deve ter no máximo 1.000 caracteres.";
  }
  if (descricaoNormalizada.length < 10 || descricaoNormalizada.length > 500) {
    return "A descrição de comportamento deve ter entre 10 e 500 caracteres.";
  }
  return null;
}

export function validarIdadePersistidaPet(
  idadeAproximada: string,
  categoria: PetAgeCategory,
): string | null {
  const idade = interpretarIdadePet(idadeAproximada);
  const resultado = validarIdadePet(idade.valor, idade.unidade);
  if (!resultado.valida) return "A idade aproximada do animal é inválida.";
  if (resultado.categoria !== categoria) return "A faixa etária não corresponde à idade aproximada informada.";
  return null;
}
