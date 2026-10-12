"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { SeletorDeslizante } from "@/components/ui/SeletorDeslizante";
import { createClient } from "@/lib/client";
import { isValidEmail } from "@/lib/validation";
import { sanitizeRedirect } from "@/components/auth/auth-features";
import {
  UserCheck,
  Building2,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect") || "/", "/");
  const initialEmail = searchParams.get("email") || "";

  const { showToast } = useApp();

  const [roleTab, setRoleTab] = useState<"adopter" | "guardian">("adopter");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const targetEmail = email.trim();
      const targetPassword = password;

      if (!targetEmail || !targetPassword) {
        setErrorMessage("Por favor, preencha o e-mail e a senha.");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      if (!isValidEmail(targetEmail)) {
        setErrorMessage("Por favor, informe um endereço de e-mail válido.");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: targetPassword,
      });

      if (error) {
        const isRateLimit =
          error.message.toLowerCase().includes("rate limit") ||
          error.code === "over_request_rate_limit";

        if (isRateLimit) {
          setErrorMessage("Muitas tentativas de login em pouco tempo. Aguarde alguns instantes antes de tentar novamente.");
        } else if (error.code === "invalid_credentials" || error.message.includes("Invalid login credentials")) {
          setErrorMessage("E-mail ou senha incorretos.");
        } else if (error.code === "email_not_confirmed" || error.message.includes("Email not confirmed")) {
          setErrorMessage("Este e-mail ainda requer confirmação no Supabase. Para login imediato sem e-mail, desative a opção 'Confirm email' no painel do Supabase (Authentication > Providers > Email).");
        } else {
          setErrorMessage(error.message);
        }
        showToast("Erro no login", isRateLimit ? "Limite temporário de tentativas. Aguarde um momento." : error.message, "error");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      if (data.session && data.user) {
        showToast("Bem-vindo(a) de volta!", "Login realizado com sucesso.", "success");
        const { data: profile, error: erroPerfil } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        if (erroPerfil || (profile?.role !== "guardian" && profile?.role !== "adopter")) {
          await supabase.auth.signOut({ scope: "local" });
          console.warn("Perfil indisponível no login:", erroPerfil?.message ?? "linha inexistente em profiles");
          const mensagem = "Sua conta não possui um perfil válido. Aplique o schema atualizado do Supabase e tente novamente.";
          setErrorMessage(mensagem);
          showToast("Perfil indisponível", mensagem, "error");
          return;
        }
        const papelUsuario = profile.role;
        if (papelUsuario === "guardian") {
          router.push(redirect === "/" ? "/dashboard" : redirect);
        } else {
          router.push(redirect);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao efetuar login.";
      setErrorMessage(msg);
      showToast("Erro no login", msg, "error");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-primary/[0.04] to-background px-4 py-10 sm:py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card p-5 shadow-lg animate-in fade-in sm:p-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" aria-label="ConnectPet — página inicial" className="relative mx-auto mb-2 block h-16 w-16 overflow-hidden rounded-full shadow-md shadow-primary/20 transition-transform hover:scale-105 sm:h-20 sm:w-20">
            <Image src="/images/logo-connectpet-redondo.png" alt="" fill sizes="80px" priority className="object-contain" />
          </Link>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Acesse o ConnectPet
          </h1>
          <p className="text-xs text-muted-foreground">
            Adoção responsável, transparente e 100% gratuita.
          </p>
        </div>

        {/* Role Tab Selector */}
        <SeletorDeslizante
          rotuloAria="Tipo de conta"
          valor={roleTab}
          aoMudar={(id) => setRoleTab(id as typeof roleTab)}
          itens={[
            { id: "adopter", rotulo: "Quero Adotar", icone: UserCheck },
            { id: "guardian", rotulo: "Sou ONG / Doador", icone: Building2 },
          ]}
          className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-secondary/50 border border-border/50"
          classeItem="py-2 rounded-xl text-xs font-bold min-h-[44px] flex items-center justify-center gap-1.5"
        />

        {/* Error Feedback */}
        {errorMessage && (
          <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-400">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label htmlFor="email-login" className="font-bold text-foreground">E-mail Cadastrado</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="email-login"
                required
                maxLength={100}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="min-h-[44px] w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="senha-login" className="font-bold text-foreground">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="senha-login"
                required
                maxLength={64}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-[44px] w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full text-xs font-bold bg-primary hover:bg-primary/90 shadow-md transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar na Plataforma"} <ArrowRight className="w-4 h-4 ml-1.5" />
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
