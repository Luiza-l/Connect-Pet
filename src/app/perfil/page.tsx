"use client";

import React, { Suspense } from "react";
import { ProfileView } from "@/views/ProfileView";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Carregando perfil...</div>}>
      <ProfileView />
    </Suspense>
  );
}
