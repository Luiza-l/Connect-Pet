import type { Metadata } from "next";
import { MapaOngsView } from "@/views/MapaOngsView";

export const metadata: Metadata = {
  title: "Mapa de ONGs | ConnectPet",
  description: "Encontre ONGs de proteção animal por município e conheça os pets disponíveis para adoção.",
};

export default function MapaOngsPage() {
  return <MapaOngsView />;
}
