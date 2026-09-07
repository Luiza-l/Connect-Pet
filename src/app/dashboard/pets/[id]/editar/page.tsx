"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PetForm } from "@/components/pets/PetForm";

interface EditPetPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPetPage({ params }: EditPetPageProps) {
  const { id } = use(params);
  const { pets } = useApp();
  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Pet</h1>
        <p className="text-muted-foreground">Atualize as informações de {pet.name}.</p>
      </div>

      <PetForm initialData={pet} isEditing />
    </div>
  );
}
