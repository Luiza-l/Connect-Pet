"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { sanitizeRedirect } from "@/components/auth/auth-features";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";
import {
  PawPrint,
  UserCheck,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Phone,
  User,
  MapPin,
  FileText,
  Briefcase,
  AtSign,
  Calendar
} from "lucide-react";

// ============================================================================
// Helpers de Validação e Formatação
// ============================================================================

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function isValidCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean.charAt(10), 10);
}

function isValidBirthDate(dateStr: string): { valid: boolean; error?: string } {
  if (!dateStr) return { valid: false, error: "Data de nascimento é obrigatória." };
  const birth = new Date(dateStr + "T00:00:00");
  if (isNaN(birth.getTime())) return { valid: false, error: "Data de nascimento inválida." };

  const today = new Date();
  if (birth > today) return { valid: false, error: "A data de nascimento não pode estar no futuro." };

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 18) {
    return { valid: false, error: "É necessário ter no mínimo 18 anos para se cadastrar." };
  }
  if (age > 120) {
    return { valid: false, error: "Data de nascimento inválida." };
  }

  return { valid: true };
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) return false;
  const ddd = parseInt(digits.slice(0, 2), 10);
  return ddd >= 11 && ddd <= 99;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function RegisterView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const safeRedirect = redirectParam ? sanitizeRedirect(redirectParam, "") : "";
  const { showToast } = useApp();

  const [roleTab, setRoleTab] = useState<"adopter" | "guardian">("adopter");

  // Adopter Form (8 campos especificados)
  const [adopterName, setAdopterName] = useState("");
  const [adopterBirthDate, setAdopterBirthDate] = useState("");
  const [adopterCpf, setAdopterCpf] = useState("");
  const [adopterSocialMedia, setAdopterSocialMedia] = useState("");
  const [adopterProfession, setAdopterProfession] = useState("");
  const [adopterPhone, setAdopterPhone] = useState("");
  const [adopterEmail, setAdopterEmail] = useState("");
  const [adopterPassword, setAdopterPassword] = useState("");

  // Guardian Form
  const [ngoName, setNgoName] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoDocument, setNgoDocument] = useState("");
  const [ngoCity, setNgoCity] = useState("São Paulo");
  const [ngoPassword, setNgoPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trava síncrona contra múltiplos envios/duplo-clique concorrente
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const supabase = createClient();
      const isAdopterRole = roleTab === "adopter";
      const targetEmail = isAdopterRole ? adopterEmail.trim() : ngoEmail.trim();
      const targetPassword = isAdopterRole ? adopterPassword : ngoPassword;

      // Validação detalhada dos campos para o perfil Adotante
      if (isAdopterRole) {
        if (!adopterName.trim() || adopterName.trim().length < 3 || adopterName.trim().split(/\s+/).length < 2) {
          const msg = "Por favor, informe seu nome completo (nome e sobrenome).";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        const dateValidation = isValidBirthDate(adopterBirthDate);
        if (!dateValidation.valid) {
          const msg = dateValidation.error || "Data de nascimento inválida.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        if (!isValidCPF(adopterCpf)) {
          const msg = "CPF inválido. Por favor, confira os números digitados.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        if (!adopterProfession.trim() || adopterProfession.trim().length < 2) {
          const msg = "Por favor, informe sua profissão ou ocupação.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        if (!isValidPhone(adopterPhone)) {
          const msg = "WhatsApp/Celular inválido. Informe o DDD e o número completo.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        if (!isValidEmail(targetEmail)) {
          const msg = "Por favor, informe um endereço de e-mail válido.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        if (targetPassword.length < 6) {
          const msg = "A senha deve conter no mínimo 6 caracteres.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }
      } else {
        // Validações básicas para Guardião / ONG
        if (!targetEmail || !targetPassword) {
          const msg = "Por favor, preencha todos os campos obrigatórios.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        if (targetPassword.length < 6) {
          const msg = "A senha deve conter no mínimo 6 caracteres.";
          setErrorMessage(msg);
          showToast("Atenção", msg, "warning");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }
      }

      const metadata = isAdopterRole
        ? {
            role: "adopter",
            name: adopterName.trim(),
            birthDate: adopterBirthDate,
            cpf: adopterCpf.trim(),
            socialMedia: adopterSocialMedia.trim() || undefined,
            profession: adopterProfession.trim(),
            primaryPhone: adopterPhone.trim()
          }
        : {
            role: "guardian",
            guardianType: "ngo",
            name: ngoName.trim(),
            document: ngoDocument.trim(),
            primaryPhone: "(11) 99888-7766",
            city: ngoCity.trim(),
            state: "SP",
            neighborhood: "Centro",
            verified: true
          };

      // 1. Criar usuário no Supabase Auth (apenas uma chamada única)
      const { data, error: authError } = await supabase.auth.signUp({
        email: targetEmail,
        password: targetPassword,
        options: {
          data: metadata
        }
      });

      if (authError) {
        const isRateLimit =
          authError.message.toLowerCase().includes("rate limit") ||
          authError.code === "over_email_send_rate_limit" ||
          authError.code === "over_request_rate_limit";

        if (isRateLimit) {
          setErrorMessage(
            "Limite de envio de e-mails atingido no Supabase. Por favor, aguarde alguns minutos antes de tentar novamente ou utilize outro e-mail."
          );
        } else if (authError.message.includes("already registered") || authError.code === "user_already_exists") {
          setErrorMessage("Este e-mail já está cadastrado. Tente fazer login.");
        } else if (authError.message.includes("Password should be")) {
          setErrorMessage("A senha é muito fraca. Utilize pelo menos 6 caracteres.");
        } else {
          setErrorMessage(authError.message);
        }

        showToast(
          "Erro no cadastro",
          isRateLimit
            ? "Limite temporário de envio atingido. Aguarde alguns minutos."
            : authError.message,
          "error"
        );
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        // 2. Persistir perfil na tabela profiles se disponível
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            role: roleTab,
            name: isAdopterRole ? adopterName.trim() : ngoName.trim(),
            email: targetEmail,
            primary_phone: isAdopterRole ? adopterPhone.trim() : "(11) 99888-7766",
            avatar: null,
            cpf: isAdopterRole ? adopterCpf.trim() : undefined,
            birth_date: isAdopterRole ? adopterBirthDate : undefined,
            profession: isAdopterRole ? adopterProfession.trim() : undefined,
            social_media: isAdopterRole ? (adopterSocialMedia.trim() || null) : null,
            guardian_type: isAdopterRole ? undefined : "ngo",
            document: isAdopterRole ? undefined : ngoDocument.trim(),
            city: isAdopterRole ? undefined : ngoCity.trim(),
            state: isAdopterRole ? undefined : "SP",
            neighborhood: isAdopterRole ? undefined : "Centro"
          });
        } catch (dbErr) {
          console.warn("Supabase profiles upsert skipped:", dbErr);
        }

        // 3. Login automático imediato sem depender de confirmação de e-mail
        let activeSession = data.session;
        if (!activeSession) {
          try {
            const { data: loginData } = await supabase.auth.signInWithPassword({
              email: targetEmail,
              password: targetPassword,
            });
            activeSession = loginData?.session || null;
          } catch {
            // Continua para o redirecionamento
          }
        }

        if (activeSession) {
          showToast("Cadastro realizado com sucesso!", `Bem-vindo(a), ${metadata.name}!`, "success");
          router.push(isAdopterRole ? (safeRedirect || "/pets") : "/dashboard");
        } else {
          showToast("Cadastro realizado com sucesso!", "Sua conta foi criada com sucesso.", "success");
          const redirectQuery = safeRedirect ? `&redirect=${encodeURIComponent(safeRedirect)}` : "";
          router.push(`/login?email=${encodeURIComponent(targetEmail)}${redirectQuery}`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocorreu um erro ao processar seu cadastro.";
      setErrorMessage(msg);
      showToast("Erro no cadastro", msg, "error");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-xl p-8 space-y-6 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 mb-2">
            <PawPrint className="w-6 h-6 fill-current" />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Criar Conta no ConnectPet
          </h1>
          <p className="text-xs text-muted-foreground">
            Junte-se à maior rede ética de acolhimento e adoção responsável.
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            {errorMessage}
          </div>
        )}

        {successInfo && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-2">
            <p className="font-bold">Quase lá!</p>
            <p>{successInfo}</p>
            <Link href="/login" className="inline-block mt-2 font-bold text-primary underline">
              Ir para tela de login
            </Link>
          </div>
        )}

        {/* Role Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-muted/60 rounded-2xl border border-border">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {roleTab === "adopter" ? (
            <>
              {/* 1. Nome Completo */}
              <div className="space-y-1">
                <label className="font-bold text-foreground">Nome Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adopterName}
                    onChange={(e) => setAdopterName(e.target.value)}
                    placeholder="Ex: Mariana da Silva Sauro"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* 2. Data de Nascimento e CPF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Data de Nascimento *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={adopterBirthDate}
                      onChange={(e) => setAdopterBirthDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Definida uma única vez no cadastro; não poderá ser alterada no dossiê de adoção.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">CPF *</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={14}
                      value={adopterCpf}
                      onChange={(e) => setAdopterCpf(formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Profissão / Ocupação e WhatsApp / Celular */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Profissão / Ocupação *</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adopterProfession}
                      onChange={(e) => setAdopterProfession(e.target.value)}
                      placeholder="Ex: Designer, Engenheiro"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">WhatsApp / Celular *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      value={adopterPhone}
                      onChange={(e) => setAdopterPhone(formatPhone(e.target.value))}
                      placeholder="(11) 98765-4321"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Rede Social (Opcional) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground">Rede Social</label>
                  <span className="text-[10px] text-muted-foreground font-normal">Opcional</span>
                </div>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adopterSocialMedia}
                    onChange={(e) => setAdopterSocialMedia(e.target.value)}
                    placeholder="@instagram ou linkedin.com/in/perfil"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* 5. E-mail */}
              <div className="space-y-1">
                <label className="font-bold text-foreground">E-mail *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adopterEmail}
                    onChange={(e) => setAdopterEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* 6. Senha */}
              <div className="space-y-1">
                <label className="font-bold text-foreground">Senha *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adopterPassword}
                    onChange={(e) => setAdopterPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Nome da ONG / Instituição *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    placeholder="Nome da organização"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">CNPJ ou CPF do Responsável *</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={ngoDocument}
                      onChange={(e) => setNgoDocument(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Cidade de Atuação *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={ngoCity}
                      onChange={(e) => setNgoCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">E-mail Institucional *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={ngoEmail}
                    onChange={(e) => setNgoEmail(e.target.value)}
                    placeholder="contato@ong.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Senha de Acesso *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={ngoPassword}
                    onChange={(e) => setNgoPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full text-xs font-bold bg-primary hover:bg-primary/90 shadow-md transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? "Criando conta..." : "Cadastrar Gratuitamente"} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Já possui conta?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Faça login aqui
          </Link>
        </div>

      </div>
    </div>
  );
}
