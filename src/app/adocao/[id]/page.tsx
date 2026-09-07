"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PetDetailView } from "@/views/PetDetailView";

interface AdoptionPageProps {
  params: Promise<{ id: string }>;
}

export default function AdoptionRoutePage({ params }: AdoptionPageProps) {
  const { id } = use(params);
  const { pets } = useApp();

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    notFound();
  }

  return <PetDetailView pet={pet} />;
}
