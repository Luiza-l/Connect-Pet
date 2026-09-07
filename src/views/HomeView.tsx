"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { PetCard } from "@/components/pets/PetCard";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Scale,
  Building2,
  ArrowRight
} from "lucide-react";

export function HomeView() {
  const { pets } = useApp();
  const featuredPets = pets.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Adoção Consciente • 100% Gratuita & Ética
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              Uma nova história de amor começa com um <span className="text-primary italic">resgate</span>.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Conectamos pessoas conscientes a ONGs e protetores sérios. Cães e gatos saudáveis, castrados e cheios de afeto que aguardam um lar seguro e definitivo.
            </p>

            {/* Key trust badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50">
                <ShieldCheck className="w-4 h-4 text-primary" /> Triagem Criteriosa
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Saúde & Vacinas Verificadas
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50">
                <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Ausência Total de Comércio
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2 w-full sm:w-auto">
              <Button size="lg" asChild className="rounded-full h-13 px-8 text-sm font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Link href="/pets">
                  <Search className="w-4 h-4 mr-2" /> Explorar Pets para Adoção
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full h-13 px-7 text-sm font-bold border-2">
                <Link href="/match">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" /> Fazer Teste de Compatibilidade
                </Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="pt-8 border-t border-border/60 grid grid-cols-3 gap-6 w-full max-w-md text-center lg:text-left">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">+1.200</p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Vidas Resgatadas</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">98.4%</p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Adaptação Perfeita</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">48</p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">ONGs Parceiras</p>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="flex-1 w-full max-w-[540px] relative">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-card">
              <Image
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop"
                alt="Pessoa sorrindo abraçando dois cachorros acolhidos com carinho"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Encontro marcado com o amor</p>
                  <p className="text-[11px] text-muted-foreground">Cada adoção responsável salva duas vidas: a que entra e a que ganha vaga na ONG.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 ml-3">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PRESENTATION SECTION ("QUEM SOMOS") */}
      <section className="py-20 bg-secondary/30 border-y border-border/40">
        <div className="container mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Transparência & Propósito
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Proteção animal ética, sem fins lucrativos e sem comércio de vidas
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              O <strong>ConnectPet</strong> nasceu para erradicar o abandono e o comércio indiscriminado de animais. Criamos uma ponte transparente entre protetores independentes, ONGs credenciadas e adotantes que compreendem que um animal é um membro da família para toda a vida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Adoção com Rigor Técnico</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Nenhum animal é entregue por impulso. Exigimos comprovação de telas de proteção, validação de maioridade (+21 anos) e estabilidade financeira mínima para cuidados contínuos.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Apoio a Protetores e ONGs</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                As ONGs recebem um painel administrativo completo e gratuito com triagem determinística automatizada, dossiê do adotante e canal de chat direto para agendamento de entrevistas.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Conformidade com a LGPD</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Seus dados cadastrais, documentos e histórico de moradia são protegidos e visualizados exclusivamente pela instituição responsável pelo animal para fins da triagem formal.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION ("POR QUE ADOTAR CONOSCO") */}
      <section id="como-funciona" className="py-20">
        <div className="container mx-auto px-4 sm:px-8 space-y-14">
          
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Passo a Passo Seguro
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Os 3 Pilares da Adoção no ConnectPet
            </h2>
            <p className="text-sm text-muted-foreground">
              Como garantimos que cada pet vá para o lar ideal e cada adotante tenha uma experiência segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground font-serif text-2xl font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                1
              </div>
              <h3 className="font-bold text-lg text-foreground">Escolha ou Calcule o Match</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Navegue pelo catálogo completo com filtros de porte, idade e temperamento ou utilize nossa Calculadora Smart Match para receber sugestões personalizadas para o seu estilo de vida.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-secondary text-foreground font-serif text-2xl font-bold flex items-center justify-center border border-border">
                2
              </div>
              <h3 className="font-bold text-lg text-foreground">Preencha o Dossiê em 5 Etapas</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Responda com transparência sobre segurança da sua moradia (telas/muros), rotina diária da família, histórico de pets e concordância unânime de todos da casa.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-secondary text-foreground font-serif text-2xl font-bold flex items-center justify-center border border-border">
                3
              </div>
              <h3 className="font-bold text-lg text-foreground">Entrevista, Visita e Acolhimento</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                A ONG analisa o dossiê, conversa com você no chat integrado, agenda a visita presencial para adaptação e oficializa o termo de tutela responsável.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PET PREVIEW SECTION */}
      <section className="py-20 bg-secondary/20 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Destaques do Catálogo
              </span>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-1">
                Conheça alguns dos nossos resgatados
              </h2>
            </div>

            <Button asChild variant="outline" className="rounded-full font-bold text-xs">
              <Link href="/pets">
                Ver todos os {pets.length} animais <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map((pet, index) => (
              <PetCard key={pet.id} pet={pet} priority={index < 2} />
            ))}
          </div>

          <div className="text-center pt-6">
            <Button size="lg" asChild className="rounded-full px-8 bg-primary hover:bg-primary/90 text-sm font-bold shadow-md">
              <Link href="/pets">
                <Search className="w-4 h-4 mr-2" /> Acessar Catálogo Completo com Filtros
              </Link>
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}
