"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { SmartMatchQuizData, MatchResult } from "@/types";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Home,
  Clock,
  Baby,
  PawPrint,
  Sliders,
  ChevronRight,
  Info
} from "lucide-react";

export function SmartMatchView() {
  const { pets, calculateSmartMatch } = useApp();

  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [quizData, setQuizData] = useState<SmartMatchQuizData>({
    housingType: "apartamento",
    hasProtection: true,
    hoursAlone: 4,
    hasChildren: false,
    hasOtherPets: false,
    preferredSpecies: "all",
    preferredSize: "all",
    energyLevel: "calm"
  });

  const questions = [
    {
      title: "Qual é o seu tipo de moradia?",
      subtitle: "Animais diferentes se adaptam melhor a espaços específicos.",
      field: "housingType",
      options: [
        { label: "Apartamento", value: "apartamento", icon: Home },
        { label: "Casa Térrea", value: "casa", icon: Home },
        { label: "Sobrado", value: "sobrado", icon: Home },
        { label: "Chácara / Sítio", value: "sitio", icon: Home }
      ]
    },
    {
      title: "Sua moradia possui proteção física completa?",
      subtitle: "Telas de segurança em janelas/sacadas ou muros altos sem rota de fuga.",
      field: "hasProtection",
      options: [
        { label: "Sim, 100% telado / muros altos seguros", value: true, icon: ShieldCheck },
        { label: "Ainda não, mas pretendo instalar", value: false, icon: ShieldCheck }
      ]
    },
    {
      title: "Quantas horas o pet ficaria sozinho por dia?",
      subtitle: "Importante para avaliar a necessidade de companhia e nível de dependência.",
      field: "hoursAlone",
      options: [
        { label: "Até 3 horas (Home office / Família sempre presente)", value: 2, icon: Clock },
        { label: "De 4 a 6 horas (Meio período)", value: 5, icon: Clock },
        { label: "Mais de 7 horas (Tempo integral no escritório)", value: 8, icon: Clock }
      ]
    },
    {
      title: "Há crianças ou idosos convivendo na casa?",
      subtitle: "Animais pacientes e gentis são ideais para essa composição familiar.",
      field: "hasChildren",
      options: [
        { label: "Sim, temos crianças pequenas em casa", value: true, icon: Baby },
        { label: "Apenas adultos e jovens", value: false, icon: Baby }
      ]
    },
    {
      title: "Você já possui outros animais em casa atualmente?",
      subtitle: "Para priorizarmos pets sociáveis com outros cães ou gatos.",
      field: "hasOtherPets",
      options: [
        { label: "Sim, já tenho cão ou gato residente", value: true, icon: PawPrint },
        { label: "Não, será o único animal no momento", value: false, icon: PawPrint }
      ]
    },
    {
      title: "Qual nível de energia combina mais com a sua rotina?",
      subtitle: "Para garantir harmonia entre seu tempo livre e as necessidades do pet.",
      field: "energyLevel",
      options: [
        { label: "Calmo (Gosta de carinho, sonecas e ambiente tranquilo)", value: "calm", icon: Sliders },
        { label: "Moderado (Passeios diários e brincadeiras pontuais)", value: "moderate", icon: Sliders },
        { label: "Alto (Adora correr, caminhadas longas e brincadeiras)", value: "high", icon: Sliders }
      ]
    },
    {
      title: "Você tem preferência por espécie ou porte?",
      subtitle: "Seja flexível se quiser ver mais opções compatíveis.",
      field: "preferredSpecies",
      options: [
        { label: "Tanto faz, quero o mais compatível", value: "all", icon: Heart },
        { label: "Prefiro Cão", value: "dog", icon: PawPrint },
        { label: "Prefiro Gato", value: "cat", icon: PawPrint }
      ]
    }
  ];

  const handleOptionSelect = (field: keyof SmartMatchQuizData, value: string | number | boolean) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  // Compute matches
  const matchResults: MatchResult[] = React.useMemo(() => {
    if (!showResults) return [];
    return pets
      .map((pet) => calculateSmartMatch(quizData, pet))
      .sort((a, b) => b.score - a.score);
  }, [showResults, pets, quizData, calculateSmartMatch]);

  const restartQuiz = () => {
    setCurrentStep(0);
    setShowResults(false);
    setHasStarted(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 md:py-16 min-h-screen space-y-12">
      
      {/* Intro Hero */}
      {!hasStarted && !showResults && (
        <div className="max-w-3xl mx-auto text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Algoritmo Determinístico de Compatibilidade
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Descubra o Pet Perfeito para o Seu Estilo de Vida
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Adoções bem-sucedidas acontecem quando o perfil comportamental do animal se alinha à rotina e ao espaço do tutor. Responda a 7 perguntas rápidas e descubra os animais ideais para o seu lar.
          </p>

          <div className="pt-4">
            <button
              onClick={() => setHasStarted(true)}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Iniciar Questionário Inteligente <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Progress & Question */}
      {hasStarted && !showResults && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
          
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Pergunta {currentStep + 1} de {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% concluído</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-card border border-border/60 shadow-xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {questions[currentStep].title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {questions[currentStep].subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {questions[currentStep].options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={String(option.value)}
                    onClick={() => handleOptionSelect(questions[currentStep].field as keyof SmartMatchQuizData, option.value)}
                    className="w-full p-4 rounded-2xl border border-border/70 hover:border-primary/50 hover:bg-primary/5 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary group-hover:bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                        {option.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>

            {currentStep > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  ← Voltar à pergunta anterior
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Results Ranking */}
      {showResults && (
        <div className="space-y-10 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Resultado do Smart Match
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-1">
                Seus Animais Ideais Ranqueados
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Com base no seu espaço, rotina e dinâmica familiar, ordenamos os pets do catálogo por compatibilidade mútua.
              </p>
            </div>

            <button
              onClick={restartQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-secondary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refazer Questionário
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-6">
            {matchResults.map((result, index) => {
              const pet = result.pet;
              const isTopMatch = index === 0;

              return (
                <div
                  key={pet.id}
                  className={`p-6 sm:p-8 rounded-3xl border bg-card shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center gap-6 ${
                    isTopMatch ? "border-primary/40 shadow-lg bg-primary/[0.02]" : "border-border/60"
                  }`}
                >
                  {/* Photo with rank badge */}
                  <div className="relative w-full lg:w-48 h-48 rounded-2xl overflow-hidden shrink-0 bg-secondary">
                    <Image
                      src={pet.photos[0]}
                      alt={pet.name}
                      fill
                      sizes="192px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      #{index + 1} no Ranking
                    </div>
                  </div>

                  {/* Core Pet & Match Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-primary tracking-wider">
                          {pet.species === "dog" ? "Cão" : "Gato"} • {pet.breed}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-foreground">
                          {pet.name}
                        </h3>
                      </div>

                      {/* Match Score Badge */}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-bold text-base sm:text-lg">{result.score}% Match</span>
                      </div>
                    </div>

                    {/* Matched Reasons */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-foreground block">Por que vocês combinam:</span>
                      <ul className="space-y-1 text-muted-foreground">
                        {result.matchedReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Adaptation Tips */}
                    {result.adaptationTips.length > 0 && (
                      <div className="p-3 rounded-xl bg-secondary/50 text-xs text-muted-foreground flex items-start gap-2">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Dica de adaptação: </strong>
                          {result.adaptationTips.join(" ")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
                    <Link
                      href={`/pets/${pet.id}`}
                      className="w-full lg:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-colors"
                    >
                      Ver Perfil & Adotar <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
