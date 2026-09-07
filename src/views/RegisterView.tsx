"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  PawPrint,
  UserCheck,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  User,
  MapPin,
  FileText
} from "lucide-react";

export function RegisterView() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useApp();

  const [roleTab, setRoleTab] = useState<"adopter" | "guardian">("adopter");

  // Adopter Form
  const [adopterName, setAdopterName] = useState("");
  const [adopterEmail, setAdopterEmail] = useState("");
  const [adopterPhone, setAdopterPhone] = useState("");
  const [adopterBirthDate, setAdopterBirthDate] = useState("1998-05-20");
  const [adopterPassword, setAdopterPassword] = useState("");

  // Guardian Form
  const [ngoName, setNgoName] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoDocument, setNgoDocument] = useState("");
  const [ngoCity, setNgoCity] = useState("São Paulo");
  const [ngoPassword, setNgoPassword] = useState("");

  const handleFillDemo = () => {
    if (roleTab === "adopter") {
      setAdopterName("Mariana Silva");
      setAdopterEmail("mariana.silva.demo@gmail.com");
      setAdopterPhone("(11) 98111-2233");
      setAdopterBirthDate("1996-08-14");
      setAdopterPassword("segredo123");
    } else {
      setNgoName("Associação Vira-Lata Feliz");
      setNgoEmail("contato@viralatafeliz.org");
      setNgoDocument("45.192.831/0001-90");
      setNgoCity("Campinas");
      setNgoPassword("segredo123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleTab === "adopter") {
      setCurrentUser({
        id: `adopter-${Date.now()}`,
        role: "adopter",
        name: adopterName,
        email: adopterEmail,
        cpf: "392.102.948-11",
        rg: "48.192.301-2",
        birthDate: adopterBirthDate,
        primaryPhone: adopterPhone,
        profession: "Profissional Autônomo",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
      });
      showToast("Cadastro realizado com sucesso!", `Bem-vindo(a), ${adopterName}!`, "success");
      router.push("/pets");
    } else {
      setCurrentUser({
        id: `guardian-${Date.now()}`,
        role: "guardian",
        guardianType: "ngo",
        name: ngoName,
        document: ngoDocument,
        email: ngoEmail,
        primaryPhone: "(11) 99888-7766",
        city: ngoCity,
        state: "SP",
        neighborhood: "Centro",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=200&auto=format&fit=crop"
      });
      showToast("Instituição cadastrada!", `Painel liberado para ${ngoName}.`, "success");
      router.push("/dashboard");
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
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Demonstração Rápida</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-bold text-primary hover:underline"
          >
            Preencher com Dados de Teste
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {roleTab === "adopter" ? (
            <>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Nome Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adopterName}
                    onChange={(e) => setAdopterName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Data de Nascimento (+21a) *</label>
                  <input
                    type="date"
                    required
                    value={adopterBirthDate}
                    onChange={(e) => setAdopterBirthDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adopterPhone}
                      onChange={(e) => setAdopterPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-xs"
                    />
                  </div>
                </div>
              </div>

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

              <div className="space-y-1">
                <label className="font-bold text-foreground">Senha *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adopterPassword}
                    onChange={(e) => setAdopterPassword(e.target.value)}
                    placeholder="••••••••"
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
            className="w-full h-12 rounded-full text-xs font-bold bg-primary hover:bg-primary/90 shadow-md"
          >
            Cadastrar Gratuitamente <ArrowRight className="w-4 h-4 ml-1.5" />
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
