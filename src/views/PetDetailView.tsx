"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pet } from "@/types";
import { useApp } from "@/context/AppContext";
import { PreAdoptionModal } from "@/components/adoption/PreAdoptionModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  MapPin,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Share2
} from "lucide-react";

interface PetDetailViewProps {
  pet: Pet;
}

export function PetDetailView({ pet }: PetDetailViewProps) {
  const router = useRouter();
  const { currentUser, isFavorite, toggleFavorite, showToast } = useApp();

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);

  const favorite = isFavorite(pet.id);

  const handleAdoptClick = () => {
    if (!currentUser) {
      showToast("Autenticação necessária", "Faça login ou cadastre-se para iniciar a pré-adoção.", "info");
      router.push("/login?redirect=" + encodeURIComponent(`/pets/${pet.id}`));
      return;
    }
    setIsAdoptionModalOpen(true);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado!", "Compartilhe para ajudar este peludinho a encontrar um lar.", "success");
    }
  };

  const sizeLabels = {
    small: "Porte Pequeno",
    medium: "Porte Médio",
    large: "Porte Grande"
  };

  const sexLabels = {
    male: "Macho",
    female: "Fêmea"
  };

  const statusMap = {
    available: { label: "Disponível para Adoção", className: "bg-emerald-500 text-white" },
    in_process: { label: "Em Processo de Triagem", className: "bg-amber-500 text-white" },
    adopted: { label: "Adotado com Amor", className: "bg-stone-500 text-white" }
  };

  const currentStatus = statusMap[pet.status] || statusMap.available;

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 md:py-16 min-h-screen space-y-10">
      
      {/* Back Button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button variant="ghost" asChild className="rounded-full text-xs hover:bg-secondary min-h-[44px] justify-start sm:justify-center w-fit">
          <Link href="/pets">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Catálogo
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-full text-xs min-h-[44px] flex-1 sm:flex-none"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFavorite(pet.id)}
            className={`rounded-full text-xs min-h-[44px] flex-1 sm:flex-none ${favorite ? "text-rose-500 border-rose-500/30 bg-rose-500/10" : ""}`}
          >
            <Heart className={`w-3.5 h-3.5 mr-1.5 ${favorite ? "fill-rose-500" : ""}`} />
            {favorite ? "Favoritado" : "Favoritar"}
          </Button>
        </div>
      </div>

      {/* Main Grid: Gallery + Core Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main HD Image */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-border shadow-md bg-secondary">
            <Image
              src={pet.photos[selectedPhotoIndex] || pet.photos[0]}
              alt={pet.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${currentStatus.className}`}>
                {currentStatus.label}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {pet.photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pet.photos.map((photo, index) => (
                <button
                  key={photo}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedPhotoIndex === index ? "border-primary scale-95 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`${pet.name} miniatura ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Overview & CTA (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {pet.species === "dog" ? "Cão Resgatado" : "Gato Resgatado"} • {pet.breed}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mt-1">
                {pet.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{pet.location.neighborhood}, {pet.location.city} - {pet.location.state}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="rounded-xl px-3 py-1 text-xs">
                {sizeLabels[pet.size]}
              </Badge>
              <Badge variant="secondary" className="rounded-xl px-3 py-1 text-xs">
                {sexLabels[pet.sex]}
              </Badge>
              <Badge variant="secondary" className="rounded-xl px-3 py-1 text-xs">
                {pet.approximateAge}
              </Badge>
            </div>

            {/* Headline */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60">
              <p className="text-xs sm:text-sm font-medium text-foreground italic leading-relaxed">
                &ldquo;{pet.headline}&rdquo;
              </p>
            </div>

            {/* Quick Health Status Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-3 rounded-2xl border ${pet.vaccinated ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : "bg-secondary border-border text-muted-foreground"}`}>
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold block">Vacinado</span>
              </div>

              <div className={`p-3 rounded-2xl border ${pet.castrated ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary border-border text-muted-foreground"}`}>
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-primary" />
                <span className="font-bold block">Castrado</span>
              </div>

              <div className={`p-3 rounded-2xl border ${pet.dewormed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : "bg-secondary border-border text-muted-foreground"}`}>
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold block">Vermifugado</span>
              </div>
            </div>

          </div>

          {/* Action Button: Quero Adotar */}
          <div className="pt-4 border-t border-border/60 space-y-3">
            <Button
              size="lg"
              onClick={handleAdoptClick}
              disabled={pet.status === "adopted"}
              className="w-full h-14 rounded-full text-base font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              {pet.status === "adopted" ? "Animal Já Adotado" : `Quero Adotar ${pet.name}`}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Adoção consciente e gratuita. Exige preenchimento de dossiê e idade mínima de 21 anos.
            </p>
          </div>

        </div>

      </div>

      {/* Deep Details: Story, Medical Record, Behavior & Guardian Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6">
        
        {/* Story & Behavior (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Rescue Story */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-sm space-y-4">
            <h3 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              História de Resgate
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {pet.story}
            </p>
          </div>

          {/* Behavior & Temperament */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-sm space-y-4">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Comportamento e Convivência
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pet.temperamentDescription}
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Traços Marcantes:
              </span>
              <div className="flex flex-wrap gap-2">
                {pet.temperament.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-xl bg-secondary font-semibold text-xs text-foreground"
                  >
                    #{trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Record */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-sm space-y-4">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Ficha Médica & Cuidados Veterinários
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-foreground">Vacinação Aplicada:</span>
                <span className="text-muted-foreground">{pet.vaccinationDetails || "Vacinação em dia."}</span>
              </div>

              {pet.specialNeeds && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-start gap-2 text-foreground">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Observações e Necessidades Especiais:</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{pet.specialNeeds}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Guardian Institutional Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-secondary/30 border border-border/60 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {pet.guardianType === "ngo" ? "ONG Verificada" : "Protetor Independente"}
                </span>
                <h4 className="font-bold text-lg text-foreground leading-tight">
                  {pet.guardianName}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Esta instituição é responsável pelo resgate, reabilitação e triagem oficial deste animal. Cada candidatura passa por análise detalhada.
            </p>

            <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{pet.location.city}, {pet.location.state}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{pet.guardianEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{pet.guardianPhone}</span>
              </div>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                asChild
                className="w-full rounded-2xl text-xs font-semibold h-11 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                <a
                  href={`https://wa.me/55${pet.guardianPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Olá! Encontrei o pet ${pet.name} no ConnectPet e gostaria de tirar dúvidas sobre o processo de adoção responsável.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Tirar Dúvidas no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Pre-Adoption Modal Wizard */}
      <PreAdoptionModal
        pet={pet}
        isOpen={isAdoptionModalOpen}
        onClose={() => setIsAdoptionModalOpen(false)}
      />

    </div>
  );
}
