"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { demoAdopter, demoGuardian } from "@/data/mockPets";
import { Button } from "@/components/ui/button";
import {
  PawPrint,
  UserCheck,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { setCurrentUser, showToast } = useApp();

  const [roleTab, setRoleTab] = useState<"adopter" | "guardian">("adopter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFillDemo = (role: "adopter" | "guardian") => {
    if (role === "adopter") {
      setEmail(demoAdopter.email);
      setPassword("adotante123");
      setRoleTab("adopter");
    } else {
      setEmail(demoGuardian.email);
      setPassword("ong123");
      setRoleTab("guardian");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleTab === "adopter") {
      setCurrentUser(demoAdopter);
      showToast("Bem-vinda de volta!", `Conectada como Camila Rodrigues.`, "success");
      router.push(redirect);
    } else {
      setCurrentUser(demoGuardian);
      showToast("Bem-vinda, ONG!", `Conectada como ONG Patinhas com Amor.`, "success");
      router.push("/dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-xl p-8 space-y-6 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 mb-2">
            <PawPrint className="w-6 h-6 fill-current" />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Acesse o ConnectPet
          </h1>
          <p className="text-xs text-muted-foreground">
            Adoção responsável, transparente e 100% gratuita.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-secondary/50 border border-border/50">
          <button
            type="button"
            onClick={() => setRoleTab("adopter")}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "adopter"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="w-4 h-4" /> Quero Adotar
          </button>
          <button
            type="button"
            onClick={() => setRoleTab("guardian")}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "guardian"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" /> Sou ONG / Doador
          </button>
        </div>

        {/* Quick Demo Fill Button */}
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Demonstração Rápida</span>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo(roleTab)}
            className="text-xs font-bold text-primary hover:underline"
          >
            Preencher Dados de Teste
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">E-mail Cadastrado</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-full text-xs font-bold bg-primary hover:bg-primary/90 shadow-md"
          >
            Entrar na Plataforma <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-bold text-primary hover:underline">
            Cadastre-se gratuitamente
          </Link>
        </div>

      </div>
    </div>
  );
}
