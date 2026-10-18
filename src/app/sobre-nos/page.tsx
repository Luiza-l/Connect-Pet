import type { Metadata } from "next";
import { SobreNosView } from "@/views/SobreNosView";

export const metadata: Metadata = {
  title: "Sobre nós | ConnectPet",
  description:
    "Conheça o ConnectPet e descubra como aproximamos animais, adotantes, ONGs e protetores em jornadas de adoção responsável.",
};

export default function SobreNosPage() {
  return <SobreNosView />;
}
