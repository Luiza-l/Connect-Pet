"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Heart,
  SlidersHorizontal,
  Sparkles,
  PawPrint,
  ArrowRight
} from "lucide-react";
import { PawWatermark } from "@/components/ui/PawWatermark";

export function HomeView() {
  const { pets, petsLoading, petsError, isFavorite, toggleFavorite, currentUser, requireAuth } = useApp();

  // 5 animais dinâmicos do catálogo real (Supabase / AppContext)
  const dynamicPets = pets.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background font-sans text-foreground selection:bg-sky-200 selection:text-sky-900 transition-colors duration-300 dark:selection:bg-sky-900 dark:selection:text-sky-100">

      {/* ========================================================================= */}
      {/* 1. SEÇÃO HERO (AZUL-CLARA COM ANIMAIS NAS LATERAIS E DIVISÃO EM ONDA)     */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-sky-200 pb-0 pt-10 dark:bg-sky-950 sm:pt-16">
        {/* Patinhas Decorativas no Banner em tom de azul levemente mais escuro */}
        {/* Patinha Superior Esquerda (acima do Dálmata) */}
        <div className="absolute left-[10%] sm:left-[14%] md:left-[18%] lg:left-[21%] top-6 sm:top-8 md:top-10 z-0">
          <PawWatermark
            rotate={-20}
            className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-sky-600/55 dark:text-sky-600/55"
          />
        </div>

        {/* Nova Patinha Meio Esquerda (posicionada mais para baixo) */}
        <div className="absolute left-[19%] sm:left-[22%] md:left-[25%] lg:left-[27%] bottom-14 sm:bottom-18 md:bottom-22 z-0">
          <PawWatermark
            rotate={14}
            className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-sky-600/50 dark:text-sky-600/50"
          />
        </div>

        {/* Patinha Inferior Esquerda (próxima à lateral do Dálmata) */}
        <div className="absolute left-[4%] sm:left-[7%] lg:left-[9%] bottom-20 sm:bottom-24 z-0">
          <PawWatermark
            rotate={24}
            className="w-8 h-8 sm:w-11 sm:h-11 lg:w-13 lg:h-13 text-sky-600/45 dark:text-sky-600/45"
          />
        </div>

        {/* Patinha Lateral Direita (perto do Border Collie) */}
        <div className="absolute right-[10%] sm:right-[14%] md:right-[18%] lg:right-[19%] top-20 sm:top-24 md:top-50 z-0">
          <PawWatermark
            rotate={18}
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-sky-600/55 dark:text-sky-600/55"
          />
        </div>

        {/* Patinha Suave Superior Direita */}
        <div className="absolute right-[32%] top-4 sm:top-6 z-0 hidden sm:block">
          <PawWatermark
            rotate={-12}
            className="w-7 h-7 sm:w-9 sm:h-9 text-sky-600/40 dark:text-sky-600/40"
          />
        </div>

        {/* Animal da Lateral Esquerda (Dálmata espiando no canto inferior esquerdo, apoiado na onda) */}
        <div className="absolute left-0 bottom-3 z-10 w-40 max-w-[42vw] select-none pointer-events-none transition-transform duration-300 hover:scale-105 sm:bottom-5 sm:w-56 sm:max-w-none md:bottom-8 md:w-72 lg:bottom-10 lg:w-96">
          <Image
            src="/images/home/hero-dog-left.png"
            alt="Cachorro Dálmata espiando"
            width={1024}
            height={859}
            priority
            className="w-full h-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Animal da Lateral Direita (Border Collie espiando colado na borda direita com focinho 100% visível) */}
        <div className="absolute right-0 bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 z-10 w-24 sm:w-32 md:w-44 lg:w-56 max-w-[28vw] sm:max-w-none select-none pointer-events-none transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/home/hero-dog-right.png"
            alt="Cachorro Border Collie espiando pela borda"
            width={601}
            height={1024}
            priority
            className="w-full h-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Conteúdo Central Exclusivo do Hero (100% livre e sem sobreposição com os mascotes) */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center justify-center pt-2 sm:pt-4 pb-20 sm:pb-28 md:py-6">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-4 py-2 text-xs font-bold text-sky-900 shadow-sm backdrop-blur-md animate-in fade-in dark:border-white/10 dark:bg-slate-900/80 dark:text-sky-200 sm:mb-5 sm:text-sm">
            <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400 sm:h-5 sm:w-5" /> Acolhimento & Adoção Responsável
          </span>
          <h1 className="max-w-xs px-2 font-serif text-3xl font-extrabold leading-tight tracking-tight text-sky-950 drop-shadow-sm dark:text-sky-50 sm:max-w-md sm:text-4xl md:max-w-2xl md:text-5xl lg:text-6xl">
            Encontre o novo membro da sua família
          </h1>
          <p className="mt-3 max-w-xs px-2 text-sm font-medium leading-relaxed text-sky-900/85 dark:text-sky-100/85 sm:mt-4 sm:max-w-md sm:text-base md:max-w-xl md:text-lg">
            Conectamos protetores e adotantes conscientes em uma jornada transparente e cheia de afeto.
          </p>
        </div>

        {/* Divisão Ondulada Suave para a próxima seção */}
        <div className="w-full overflow-hidden leading-none z-20 relative -mb-1">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-14 md:h-24 lg:h-28 text-background fill-current block transition-colors duration-300"
            preserveAspectRatio="none"
          >
            <path d="M0,32 C280,105 480,15 760,65 C1040,115 1280,25 1440,45 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CARDS DE AÇÕES COM ANIMAIS NO TOPO                                    */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-background pt-4 pb-16 sm:pb-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 sm:gap-y-20 pt-10 sm:pt-14">

            {/* Card 1: Encontre seu companheiro (Beagle) */}
            <Link
              href="/pets"
              className="group relative mx-auto flex min-h-[320px] w-full max-w-sm flex-col items-center justify-between rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/15 to-primary/5 px-5 pb-6 pt-14 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:from-primary/20 dark:to-card sm:max-w-none sm:px-6 sm:pt-16"
            >
              {/* Pet Sobreposto no Topo */}
              <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-32 sm:w-40 pointer-events-none select-none transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/home/card-beagle.png"
                  alt="Beagle com patinhas apoiadas"
                  width={1024}
                  height={524}
                  className="w-full h-auto object-contain drop-shadow"
                />
              </div>

              <div className="flex flex-col items-center">
                {/* Ícone Estilizado: Filtros */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/40 bg-card/95 text-sky-700 shadow-sm transition-all group-hover:scale-110 group-hover:bg-card dark:bg-white/95 dark:group-hover:bg-white sm:h-16 sm:w-16">
                  <SlidersHorizontal className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2] text-sky-800" />
                </div>

                <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  Encontre seu companheiro
                </h2>

                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  Use os filtros para encontrar pets de acordo com espécie, idade, porte e outras características.
                </p>
              </div>

              <div className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 border-t border-border/60 pt-3 text-sm font-bold text-primary transition-colors">
                <span>Ver catálogo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Conheça antes de adotar (Gatinho Laranja) */}
            <Link
              href="/#como-funciona"
              className="group relative mx-auto flex min-h-[320px] w-full max-w-sm flex-col items-center justify-between rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/15 to-primary/5 px-5 pb-6 pt-14 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:from-primary/20 dark:to-card sm:max-w-none sm:px-6 sm:pt-16"
            >
              {/* Pet Sobreposto no Topo */}
              <div className="absolute -top-14 sm:-top-20 left-1/2 -translate-x-1/2 w-32 sm:w-40 pointer-events-none select-none transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/home/card-cat-orange.png"
                  alt="Gatinho laranja com patinhas apoiadas"
                  width={1024}
                  height={726}
                  className="w-full h-auto object-contain drop-shadow"
                />
              </div>

              <div className="flex flex-col items-center">
                {/* Ícone Estilizado: Sparkles */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/40 bg-card/95 text-sky-700 shadow-sm transition-all group-hover:scale-110 group-hover:bg-card dark:bg-white/95 dark:group-hover:bg-white sm:h-16 sm:w-16">
                  <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2] text-sky-800" />
                </div>

                <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  Conheça antes de adotar
                </h2>

                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  Veja informações sobre cada pet, conheça sua personalidade e descubra se vocês combinam.
                </p>
              </div>

              <div className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 border-t border-border/60 pt-3 text-sm font-bold text-primary transition-colors">
                <span>Como funciona</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Salve seus favoritos (Dachshund) */}
            <Link
              href="/pets?favoritos=true"
              onClick={(e) => {
                if (!currentUser) {
                  e.preventDefault();
                  requireAuth("favorites", { redirectTo: "/pets?favoritos=true" });
                }
              }}
              className="group relative mx-auto flex min-h-[320px] w-full max-w-sm flex-col items-center justify-between rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/15 to-primary/5 px-5 pb-6 pt-14 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:from-primary/20 dark:to-card sm:max-w-none sm:px-6 sm:pt-16"
            >
              {/* Pet Sobreposto no Topo */}
              <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-32 sm:w-44 pointer-events-none select-none transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/home/card-dachshund.png"
                  alt="Dachshund de pelo longo com patinhas apoiadas"
                  width={1024}
                  height={441}
                  className="w-full h-auto object-contain drop-shadow"
                />
              </div>

              <div className="flex flex-col items-center">
                {/* Ícone Estilizado: Coração */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/40 bg-card/95 text-rose-500 shadow-sm transition-all group-hover:scale-110 group-hover:bg-card dark:bg-white/95 dark:group-hover:bg-white sm:h-16 sm:w-16">
                  <Heart className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2] text-rose-500 fill-rose-100" />
                </div>

                <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  Salve seus favoritos
                </h2>

                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  Encontrou um pet que chamou sua atenção? Salve seus favoritos para encontrá-los novamente depois.
                </p>
              </div>

              <div className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 border-t border-border/60 pt-3 text-sm font-bold text-primary transition-colors">
                <span>Ver favoritos</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Seu próximo melhor amigo (Gatinho Rajado) */}
            <Link
              href="/pets"
              className="group relative mx-auto flex min-h-[320px] w-full max-w-sm flex-col items-center justify-between rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/15 to-primary/5 px-5 pb-6 pt-14 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:from-primary/20 dark:to-card sm:max-w-none sm:px-6 sm:pt-16"
            >
              {/* Pet Sobreposto no Topo */}
              <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-32 sm:w-40 pointer-events-none select-none transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/home/card-cat-tabby.png"
                  alt="Gatinho rajado com patinhas apoiadas"
                  width={1024}
                  height={512}
                  className="w-full h-auto object-contain drop-shadow"
                />
              </div>

              <div className="flex flex-col items-center">
                {/* Ícone Estilizado: Patinha */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/40 bg-card/95 text-sky-700 shadow-sm transition-all group-hover:scale-110 group-hover:bg-card dark:bg-white/95 dark:group-hover:bg-white sm:h-16 sm:w-16">
                  <PawPrint className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2] text-sky-800" />
                </div>

                <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  Seu próximo melhor amigo
                </h2>

                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  Explore os animais disponíveis e encontre aquele que pode fazer parte da sua família.
                </p>
              </div>

              <div className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 border-t border-border/60 pt-3 text-sm font-bold text-primary transition-colors">
                <span>Adotar agora</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEÇÃO: OS 3 PILARES DA ADOÇÃO NO CONNECTPET                            */}
      {/* ========================================================================= */}
      <section id="como-funciona" className="relative w-full bg-background py-12 sm:py-16 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          {/* Título Estilizado em Azul Celeste */}
          <h2 className="mx-auto max-w-xl text-balance font-serif text-2xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
            Os 3 Pilares da Adoção<br />no ConnectPet
          </h2>

          {/* Ilustração Panorâmica da Trilha com Pins e Patinhas */}
          <div className="relative mx-auto my-6 aspect-[3/1] w-full max-w-6xl overflow-hidden sm:my-8">
            <Image
              src="/images/imagem-sobre.png"
              alt="Os 3 Pilares da Adoção no ConnectPet"
              width={1448}
              height={1086}
              priority
              className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 select-none object-contain"
            />
          </div>

          {/* 3 Colunas de Texto com os Títulos e Descrições de Cada Pilar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 mt-4 text-center">
            {/* Pilar 1 */}
            <div className="flex flex-col items-center px-4 p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 md:bg-transparent md:dark:bg-transparent">
              <span className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold text-sm flex items-center justify-center mb-3">
                1
              </span>
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                Encontre seu Pet
              </h3>
              <p className="text-sm sm:text-[0.9375rem] text-slate-600 dark:text-slate-400 leading-relaxed mt-2 max-w-xs">
                Navegue pelo catálogo com filtros inteligentes. Tudo em um só lugar, tornando o processo ágil e eficiente.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="flex flex-col items-center px-4 p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 md:bg-transparent md:dark:bg-transparent">
              <span className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold text-sm flex items-center justify-center mb-3">
                2
              </span>
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                Divulgue + Fácil
              </h3>
              <p className="text-sm sm:text-[0.9375rem] text-slate-600 dark:text-slate-400 leading-relaxed mt-2 max-w-xs">
                Centralize a divulgação dos pets e alcance pessoas realmente interessadas. Simplificamos a busca pelo lar perfeito.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="flex flex-col items-center px-4 p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 md:bg-transparent md:dark:bg-transparent">
              <span className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold text-sm flex items-center justify-center mb-3">
                3
              </span>
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                Gestão e Triagem
              </h3>
              <p className="text-sm sm:text-[0.9375rem] text-slate-600 dark:text-slate-400 leading-relaxed mt-2 max-w-xs">
                Organize os pedidos de adoção, utilize nosso formulário de pré-adoção e encontre lares seguros para os animais.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SEÇÃO: DICAS PARA CUIDAR DO SEU PET (AZUL COM ONDA EM NUVEM E DICAS)  */}
      {/* ========================================================================= */}
      <section id="dicas" className="relative w-full overflow-hidden bg-sky-200 pb-0 pt-12 dark:bg-sky-950 sm:pt-16">

        {/* Patinhas decorativas distribuídas organicamente e de forma assimétrica pelo fundo azul
        {/* 1. Esquerda alta, inclinada perto da curva da nuvem *
        <div className="absolute left-[7%] sm:left-[11%] lg:left-[13%] top-16 sm:top-20 z-10">
          <PawWatermark
            rotate={-32}
            className="w-12 h-12 sm:w-15 sm:h-15 lg:w-17 lg:h-17 text-sky-600/55 dark:text-sky-300/35"
          />
        </div>

        {/* 2. Esquerda intermediária mais interna 
        <div className="absolute left-[16%] sm:left-[20%] lg:left-[23%] top-36 sm:top-40 z-10 hidden sm:block">
          <PawWatermark
            rotate={14}
            className="w-8 h-8 sm:w-11 sm:h-11 text-sky-600/40 dark:text-sky-300/25"
          />
        </div>

        {/* 3. Esquerda na borda extrema média-baixa 
        <div className="absolute left-[2%] sm:left-[4%] lg:left-[6%] top-[56%] -translate-y-1/2 z-10">
          <PawWatermark
            rotate={-18}
            className="w-10 h-10 sm:w-13 sm:h-13 lg:w-15 lg:h-15 text-sky-600/50 dark:text-sky-300/30"
          />
        </div>

        {/* 4. Esquerda inferior caminhando para o centro 
        <div className="absolute left-[12%] sm:left-[15%] lg:left-[18%] bottom-20 sm:bottom-24 z-10">
          <PawWatermark
            rotate={26}
            className="w-9 h-9 sm:w-12 sm:h-12 text-sky-600/45 dark:text-sky-300/30"
          />
        </div>

        {/* 5. Canto inferior esquerdo perto da onda 
        <div className="absolute left-[4%] sm:left-[7%] bottom-8 sm:bottom-10 z-10">
          <PawWatermark
            rotate={-8}
            className="w-11 h-11 sm:w-14 sm:h-14 text-sky-600/45 dark:text-sky-300/25"
          />
        </div>

        {/* 6. Centro-topo suave esquerdo 
        <div className="absolute left-[33%] top-8 sm:top-12 z-10 hidden md:block">
          <PawWatermark
            rotate={-12}
            className="w-7 h-7 sm:w-9 sm:h-9 text-sky-600/35 dark:text-sky-300/20"
          />
        </div>

        {/* 7. Direita alta bem perto do topo 
        <div className="absolute right-[14%] sm:right-[18%] lg:right-[21%] top-12 sm:top-14 z-10">
          <PawWatermark
            rotate={20}
            className="w-9 h-9 sm:w-12 sm:h-12 text-sky-600/45 dark:text-sky-300/30"
          />
        </div>

        {/* 8. Direita externa superior 
        <div className="absolute right-[3%] sm:right-[5%] lg:right-[8%] top-28 sm:top-32 z-10">
          <PawWatermark
            rotate={-25}
            className="w-12 h-12 sm:w-15 sm:h-15 lg:w-17 lg:h-17 text-sky-600/55 dark:text-sky-300/35"
          />
        </div>

        {/* 9. Direita média mais recolhida para dentro 
        <div className="absolute right-[11%] sm:right-[14%] lg:right-[16%] top-[50%] -translate-y-1/2 z-10">
          <PawWatermark
            rotate={12}
            className="w-10 h-10 sm:w-13 sm:h-13 text-sky-600/45 dark:text-sky-300/30"
          />
        </div>

        {/* 10. Direita borda extrema inferior  
        <div className="absolute right-[2%] sm:right-[4%] lg:right-[6%] bottom-28 sm:bottom-32 z-10">
          <PawWatermark
            rotate={-16}
            className="w-8 h-8 sm:w-11 sm:h-11 text-sky-600/40 dark:text-sky-300/25"
          />
        </div>

        {/* 11. Direita inferior caminhando para a onda de baixo 
        <div className="absolute right-[18%] sm:right-[22%] lg:right-[25%] bottom-10 sm:bottom-14 z-10">
          <PawWatermark
            rotate={30}
            className="w-11 h-11 sm:w-14 sm:h-14 text-sky-600/50 dark:text-sky-300/30"
          />
        </div>

        {/* 12. Centro-inferior direito perto da borda da onda  
        <div className="absolute right-[34%] bottom-6 sm:bottom-8 z-10 hidden md:block">
          <PawWatermark
            rotate={16}
            className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600/35 dark:text-sky-300/20"
          />
        </div>  */}
        
        {/* Onda Superior Estilo Nuvem Conectando 'Como Funciona' e 'Dicas' */}
        <div className="w-full overflow-hidden leading-none absolute top-0 left-0 right-0 z-10 -mt-0.5">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 sm:h-20 md:h-28 text-background fill-current block transition-colors duration-300"
            preserveAspectRatio="none"
          >
            <path d="M 0,0 L 1440,0 L 1440,30 C 1370,90 1290,115 1200,115 C 1110,115 1030,90 960,25 C 890,90 810,120 720,120 C 630,120 550,90 480,25 C 410,90 330,115 240,115 C 150,115 70,90 0,30 Z" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 relative z-20 max-w-4xl text-center">
          
          {/* Composição Ilustrada com Fundo Transparente (Dachshund, Setas e Dicas) */}
          <div className="relative w-full max-w-2xl mx-auto my-2 sm:my-4 px-2 select-none">
            <Image
              src="/images/home/dicas-composition.png"
              alt="Dicas Para Cuidar do Seu Pet: Ambiente seguro, alimentação, socialização, brincadeiras e treinamento"
              width={1024}
              height={906}
              priority
              className="w-full h-auto object-contain mx-auto drop-shadow-sm"
            />
          </div>

        </div>

        {/* Onda Inferior Transição Azul -> Seção Seguinte */}
        <div className="w-full overflow-hidden leading-none relative z-10 -mb-[1px] mt-8 sm:mt-12">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 sm:h-20 md:h-28 text-background fill-current block transition-colors duration-300"
            preserveAspectRatio="none"
          >
            <path d="M0,45 C280,0 520,85 860,35 C1180,0 1360,70 1440,50 L1440,90 L0,90 Z" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SEÇÃO: CATÁLOGO DINÂMICO DE ANIMAIS (SUPABASE)                         */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-background pt-4 pb-16 sm:pb-24 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <span className="section-kicker">Novos amigos esperando por você</span>
            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Conheça alguns pets disponíveis
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Perfis reais de animais acolhidos por ONGs e protetores responsáveis.
            </p>
          </div>

          {/* Grade com Cards de Pets Reais (Consumidos do Supabase / AppContext) */}
          {petsLoading && (
            <p className="mb-6 text-center text-sm text-muted-foreground" role="status">Carregando animais disponíveis...</p>
          )}
          {!petsLoading && petsError && (
            <p className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive" role="alert">
              Não foi possível carregar os animais agora. Acesse o catálogo para tentar novamente.
            </p>
          )}
          {!petsLoading && !petsError && dynamicPets.length === 0 && (
            <p className="mb-6 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
              Ainda não há animais publicados no catálogo.
            </p>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {dynamicPets.map((pet) => {
              const favorite = isFavorite(pet.id);
              const mainPhoto =
                pet.photos && pet.photos.length > 0 && pet.photos[0]
                  ? pet.photos[0]
                  : "/images/pet-placeholder.svg";

              return (
                <div
                  key={pet.id}
                  className="group relative mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:max-w-none"
                >
                  {/* Foto do Pet com Moldura Azul Estilo Canva */}
                  <Link href={`/pets/${pet.id}`} className="relative aspect-square w-full overflow-hidden bg-sky-50 dark:bg-sky-950/40 block">
                    <Image
                      src={mainPhoto}
                      alt={pet.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Botão de Favorito no Canto Superior Direito */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(pet.id);
                      }}
                      aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      className="absolute right-2.5 top-2.5 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/70 bg-card/95 text-slate-600 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:text-rose-500 active:scale-95 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-300"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorite ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                    </button>
                  </Link>

                  {/* Informações Resumidas do Pet */}
                  <div className="flex flex-1 flex-col justify-between bg-card p-4 sm:p-5">
                    <div>
                      <div className="flex items-center justify-between gap-1.5">
                        <Link href={`/pets/${pet.id}`}>
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                            {pet.name}
                          </h3>
                        </Link>
                        <span className="whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          {pet.approximateAge || "Idade não informada"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium">
                        {pet.breed || "SRD"} • {pet.species === "dog" ? "Cachorro" : "Gato"}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sky-100 dark:border-slate-800/80 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      <span className="line-clamp-1 font-medium">
                        {[pet.location?.city, pet.location?.state].filter(Boolean).join(", ") || "Localização não informada"}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          pet.status === "available" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        title={pet.status === "available" ? "Disponível" : "Em Processo"}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão Central Estilo Pílula Azul: Acessar Catálogo Completo com Filtros */}
          <div className="flex justify-center mt-10 sm:mt-14">
            <Link
              href="/pets"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm font-extrabold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg active:translate-y-0 sm:px-10 sm:py-4 sm:text-base"
            >
              <Search className="h-5 w-5 stroke-[2.5]" />
              <span>Acessar Catálogo Completo</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
