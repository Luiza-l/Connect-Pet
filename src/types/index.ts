export type PetSize = 'Pequeno' | 'Médio' | 'Grande';
export type PetGender = 'Macho' | 'Fêmea';
export type PetSpecies = 'Cachorro' | 'Gato' | 'Outro';
export type PetStatus = 'Disponível' | 'Adotado' | 'Em processo';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  size: PetSize;
  age: string; // Ex: '2 anos', '3 meses'
  gender: PetGender;
  vaccinated: boolean;
  castrated: boolean;
  images: string[];
  history: string;
  temperament: string[];
  location: string;
  status: PetStatus;
  ownerId?: string; // Futuramente vincula ao usuário (ONG/Protetor)
  isOng?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Adotante' | 'Protetor' | 'ONG';
  avatarUrl?: string;
  phone?: string;
}
