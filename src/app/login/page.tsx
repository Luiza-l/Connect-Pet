"use client";

import React, { Suspense } from "react";
import { LoginView } from "@/views/LoginView";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Carregando login...</div>}>
      <LoginView />
    </Suspense>
  );
}
