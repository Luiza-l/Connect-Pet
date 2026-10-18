import type { Pet } from "@/types";

export function obterPetsDoCatalogo<T extends Pick<Pet, "status">>(pets: readonly T[]): T[] {
  return pets.filter((pet) => pet.status !== "adopted");
}
