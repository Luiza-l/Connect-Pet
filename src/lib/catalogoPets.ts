import type { Pet } from "@/types";

export function obterPetsDoCatalogo<T extends Pick<Pet, "status">>(pets: readonly T[]): T[] {
  return pets.filter((pet) => pet.status !== "adopted");
}

/** Um identificador inválido produz uma lista vazia, preservando o escopo pedido na URL. */
export function filtrarPetsDaOng<T extends Pick<Pet, "status" | "guardianId" | "guardianType">>(pets: readonly T[], idOng: string | null): T[] {
  if (idOng === null) return [...pets];
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOng)) return [];
  return pets.filter((pet) => pet.guardianId.toLowerCase() === idOng.toLowerCase() && pet.guardianType === "ngo" && pet.status === "available");
}
