"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PetDetailView } from "@/views/PetDetailView";

interface PetDetailsProps {
  params: Promise<{ id: string }>;
}

export default function PetDetailsPage({ params }: PetDetailsProps) {
  const { id } = use(params);
  const { pets } = useApp();

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    notFound();
  }

  return <PetDetailView pet={pet} />;
}
