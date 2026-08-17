"use client";

import { useState } from "react";
import { PetGrid } from "@/components/pets/PetGrid";
import { mockPets } from "@/data/pets";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

export default function PetsCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPets = mockPets.filter(pet => {
    if (!searchTerm) return true;
    return pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           pet.species.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const FiltersContent = () => (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Buscar por nome ou espécie</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Ex: Cachorro, Luna..." 
            className="pl-10 h-11 bg-muted/30 border-transparent focus-visible:bg-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base font-semibold">Espécie (Mock)</Label>
        <div className="flex flex-col gap-3">
          {["Todos", "Cachorro", "Gato"].map(s => (
            <label key={s} className="flex items-center gap-3 text-sm cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="radio" name="species" className="peer sr-only" defaultChecked={s === "Todos"} />
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">{s}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base font-semibold">Porte (Mock)</Label>
        <div className="flex flex-col gap-3">
          {["Todos", "Pequeno", "Médio", "Grande"].map(s => (
            <label key={s} className="flex items-center gap-3 text-sm cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="radio" name="size" className="peer sr-only" defaultChecked={s === "Todos"} />
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">{s}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 md:py-20 min-h-screen">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Encontre seu novo amigo</h1>
          <p className="text-lg text-muted-foreground">Temos <span className="font-bold text-foreground">{mockPets.length} pets</span> esperando por adoção no momento.</p>
        </div>
        
        {/* Mobile Filters Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden w-full h-12 text-base glass">
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl font-bold">Filtros</SheetTitle>
            </SheetHeader>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Desktop Sidebar Filters */}
        <motion.aside 
          className="hidden md:block w-72 shrink-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sticky top-28 border border-border/50 rounded-3xl p-8 bg-card shadow-sm">
            <h2 className="font-bold text-xl mb-8 flex items-center text-primary">
              <SlidersHorizontal className="mr-3 h-5 w-5" /> Filtros
            </h2>
            <FiltersContent />
          </div>
        </motion.aside>

        {/* Pet Grid */}
        <main className="flex-1">
          <PetGrid pets={filteredPets} />
        </main>
      </div>
    </div>
  );
}
