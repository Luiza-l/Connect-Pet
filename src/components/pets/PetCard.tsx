"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pet } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Pega até 3 temperamentos para mostrar
  const displayTemperaments = pet.temperament.slice(0, 3);
  const extraTemperaments = pet.temperament.length > 3 ? pet.temperament.length - 3 : 0;

  return (
    <Card className="overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-border/50 bg-card rounded-[1.5rem] flex flex-col h-full">
      <CardHeader className="p-0 relative h-[240px] shrink-0 overflow-hidden">
        <Image
          src={pet.images[0] || "/placeholder.jpg"}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Status Badge (Top Left) */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary/90 hover:bg-primary text-white border-transparent px-3 py-1 flex items-center gap-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {pet.status === "Disponível" ? "Disponível para adoção" : pet.status}
          </Badge>
        </div>
        
        {/* Favorite Button (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 border ${
              isFavorite 
                ? 'bg-primary text-white border-primary shadow-md scale-110' 
                : 'bg-black/30 text-white hover:bg-primary/80 border-white/20 hover:scale-105'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Info Badges (Bottom Left over image) */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {pet.castrated && (
            <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm">
              Castrado(a)
            </span>
          )}
          {pet.vaccinated && (
            <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm">
              Vacinado(a)
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Espécie, Gênero e Org */}
        <div className="flex justify-between items-center mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>{pet.species} &bull; {pet.gender}</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> {pet.isOng ? "ONG" : "Protetor"}
          </span>
        </div>
        
        {/* Nome e Idade */}
        <div className="flex justify-between items-end mb-1">
          <h3 className="font-serif text-[1.75rem] leading-none font-bold text-foreground">{pet.name}</h3>
          <span className="text-xs font-medium text-muted-foreground pb-0.5">{pet.age}</span>
        </div>
        
        {/* Raça e Porte */}
        <p className="text-xs text-muted-foreground mb-4 font-medium">
          {pet.breed || "SRD"} &bull; Porte {pet.size}
        </p>

        {/* Quote / History Snippet */}
        <p className="text-sm italic text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          "{pet.history.substring(0, 100)}..."
        </p>
        
        {/* Temperamento Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto mb-1">
          {displayTemperaments.map((temp, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-secondary/40 text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
              {temp}
            </span>
          ))}
          {extraTemperaments > 0 && (
            <span className="px-2 py-1 bg-secondary/20 text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
              +{extraTemperaments}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-3 border-t border-border/50 flex justify-between items-center bg-muted/10">
        <div className="flex items-center text-xs font-medium text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 mr-1 text-primary" />
          <span className="truncate max-w-[120px]">{pet.location}</span>
        </div>
        <Link 
          href={`/pets/${pet.id}`}
          className="text-xs font-bold bg-secondary/50 text-foreground hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-full transition-colors"
        >
          Conhecer {pet.name}
        </Link>
      </CardFooter>
    </Card>
  );
}
