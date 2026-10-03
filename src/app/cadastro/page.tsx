"use client";

import React, { Suspense } from "react";
import { RegisterView } from "@/views/RegisterView";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Carregando cadastro...</div>}>
      <RegisterView />
    </Suspense>
  );
}
