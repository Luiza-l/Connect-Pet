"use client";

import React, { Suspense } from "react";
import { CatalogView } from "@/views/CatalogView";

export default function PetsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Carregando catálogo...</div>}>
      <CatalogView />
    </Suspense>
  );
}
