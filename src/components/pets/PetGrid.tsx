"use client";

import { Pet } from "@/types";
import { PetCard } from "./PetCard";
import { motion } from "framer-motion";

interface PetGridProps {
  pets: Pet[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function PetGrid({ pets }: PetGridProps) {
  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum pet encontrado com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {pets.map((pet) => (
        <motion.div key={pet.id} variants={item}>
          <PetCard pet={pet} />
        </motion.div>
      ))}
    </motion.div>
  );
}
