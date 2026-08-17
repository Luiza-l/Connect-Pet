import { Pet } from "@/types";

export const mockPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    species: "Cachorro",
    size: "Médio",
    age: "2 anos",
    gender: "Fêmea",
    vaccinated: true,
    castrated: true,
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop"
    ],
    history: "Luna foi encontrada abandonada em uma praça. Ela é muito dócil e adora brincar com bolinhas.",
    temperament: ["Dócil", "Brincalhona", "Sociável"],
    location: "São Paulo, SP",
    status: "Disponível",
    isOng: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mia",
    species: "Gato",
    size: "Pequeno",
    age: "8 meses",
    gender: "Fêmea",
    vaccinated: true,
    castrated: false,
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop"
    ],
    history: "Mia é uma gatinha resgatada de um telhado. Muito carinhosa, gosta de dormir no colo.",
    temperament: ["Carinhosa", "Calma", "Dorminhoca"],
    location: "Rio de Janeiro, RJ",
    status: "Disponível",
    isOng: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Thor",
    species: "Cachorro",
    size: "Grande",
    age: "4 anos",
    gender: "Macho",
    vaccinated: true,
    castrated: true,
    images: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop"
    ],
    history: "Thor é um cachorro forte mas com coração de manteiga. Precisa de espaço para correr.",
    temperament: ["Protetor", "Energético", "Fiel"],
    location: "Campinas, SP",
    status: "Disponível",
    isOng: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Simba",
    species: "Gato",
    size: "Pequeno",
    age: "1 ano",
    gender: "Macho",
    vaccinated: false,
    castrated: false,
    images: [
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=600&auto=format&fit=crop"
    ],
    history: "Simba foi encontrado em uma caixa de papelão. Adora explorar todos os cantos da casa.",
    temperament: ["Curioso", "Independente"],
    location: "Belo Horizonte, MG",
    status: "Em processo",
    isOng: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Bob",
    species: "Cachorro",
    size: "Pequeno",
    age: "3 meses",
    gender: "Macho",
    vaccinated: true,
    castrated: false,
    images: [
      "https://images.unsplash.com/photo-1537151608804-ea6f117c06eb?q=80&w=600&auto=format&fit=crop"
    ],
    history: "Filhote resgatado junto com seus irmãozinhos. Muito brincalhão e esperto.",
    temperament: ["Filhote", "Curioso", "Ativo"],
    location: "Curitiba, PR",
    status: "Disponível",
    isOng: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Nina",
    species: "Cachorro",
    size: "Médio",
    age: "5 anos",
    gender: "Fêmea",
    vaccinated: true,
    castrated: true,
    images: [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=600&auto=format&fit=crop"
    ],
    history: "Nina perdeu sua antiga tutora. É uma cadelinha muito dócil que precisa de um lar calmo.",
    temperament: ["Dócil", "Calma", "Amorosa"],
    location: "São Paulo, SP",
    status: "Disponível",
    isOng: false,
    createdAt: new Date().toISOString(),
  }
];
