"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Pet,
  CurrentUser,
  PreAdoptionApplication,
  ApplicationStatus,
  SmartMatchQuizData,
  MatchResult
} from '../types';
import { mockPets as initialMockPets, demoAdopter, demoGuardian, initialApplications } from '../data/mockPets';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Current User
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  switchUser: (role: 'adopter' | 'guardian') => void;
  logout: () => void;

  // Pets
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (petId: string) => void;
  isFavorite: (petId: string) => boolean;

  // Applications
  applications: PreAdoptionApplication[];
  submitApplication: (applicationData: Omit<PreAdoptionApplication, 'id' | 'createdAt' | 'status' | 'notes' | 'messages' | 'automatedAnalysis'>) => PreAdoptionApplication;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  updateGuardianNotes: (appId: string, notes: string) => void;
  sendApplicationMessage: (appId: string, content: string) => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;

  // Deterministic Algorithms & Rules
  calculateAge: (birthDate: string) => number;
  isAgeAllowed: (birthDate: string) => boolean;
  analyzeDossier: (app: Partial<PreAdoptionApplication>) => NonNullable<PreAdoptionApplication['automatedAnalysis']>;
  calculateSmartMatch: (quiz: SmartMatchQuizData, pet: Pet) => MatchResult;
}

const STORAGE_KEYS = {
  PETS: 'acolher_pets_v1',
  APPLICATIONS: 'acolher_applications_v1',
  USER: 'acolher_user_v1',
  FAVORITES: 'acolher_favorites_v1',
  THEME: 'acolher_theme_mode_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function normalizePet(raw: unknown): Pet {
  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const photos = Array.isArray(rawObj.photos) && rawObj.photos.length > 0
    ? (rawObj.photos as string[])
    : Array.isArray(rawObj.images) && rawObj.images.length > 0
    ? (rawObj.images as string[])
    : ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop"];

  let location = { city: "São Paulo", state: "SP", neighborhood: "Vila Mariana" };
  if (raw?.location && typeof raw.location === "object") {
    location = {
      city: raw.location.city || "São Paulo",
      state: raw.location.state || "SP",
      neighborhood: raw.location.neighborhood || "Vila Mariana"
    };
  } else if (typeof raw?.location === "string") {
    const parts = raw.location.split(",").map((s: string) => s.trim());
    location = {
      city: parts[0] || "São Paulo",
      state: parts[1] || "SP",
      neighborhood: "Vila Mariana"
    };
  }

  let temperament: string[] = ["Dócil", "Sociável"];
  if (Array.isArray(raw?.temperament)) {
    temperament = raw.temperament;
  } else if (typeof raw?.temperament === "string") {
    temperament = raw.temperament.split(",").map((s: string) => s.trim()).filter(Boolean);
  }

  return {
    id: String(raw?.id || `pet-${Date.now()}`),
    name: raw?.name || "Sem Nome",
    species: raw?.species === "cat" || raw?.species === "Gato" ? "cat" : "dog",
    breed: raw?.breed || "Vira-lata (SRD)",
    size: raw?.size === "small" || raw?.size === "Pequeno" ? "small" : raw?.size === "large" || raw?.size === "Grande" ? "large" : "medium",
    approximateAge: raw?.approximateAge || raw?.age || "1 ano",
    ageCategory: raw?.ageCategory || "young",
    sex: raw?.sex === "female" || raw?.gender === "Fêmea" ? "female" : "male",
    status: raw?.status === "adopted" || raw?.status === "Adotado" ? "adopted" : raw?.status === "in_process" || raw?.status === "Em processo" ? "in_process" : "available",
    vaccinated: !!raw?.vaccinated,
    castrated: !!raw?.castrated,
    dewormed: raw?.dewormed !== undefined ? !!raw?.dewormed : true,
    vaccinationDetails: raw?.vaccinationDetails || "Vacinação em dia.",
    specialNeeds: raw?.specialNeeds || "",
    photos,
    headline: raw?.headline || "Pronto para um novo lar cheio de carinho.",
    story: raw?.story || raw?.history || "Resgatado com carinho, aguarda uma família amorosa e responsável.",
    temperament: temperament.length > 0 ? temperament : ["Dócil"],
    temperamentDescription: raw?.temperamentDescription || "Muito dócil, companheiro e educado.",
    guardianId: raw?.guardianId || "guardian-1",
    guardianName: raw?.guardianName || (raw?.isOng ? "ONG Patinhas com Amor" : "Protetor Independente"),
    guardianType: raw?.guardianType || (raw?.isOng ? "ngo" : "individual"),
    guardianPhone: raw?.guardianPhone || "(11) 97123-9988",
    guardianEmail: raw?.guardianEmail || "contato@patinhascomamor.org.br",
    location,
    createdAt: raw?.createdAt || new Date().toISOString()
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // 1. Theme State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
        if (savedTheme) return savedTheme;
      } catch {}
    }
    return 'system';
  });

  // 2. User State
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (savedUser) return JSON.parse(savedUser);
      } catch {}
    }
    return demoAdopter;
  });

  // 3. Pets State
  const [pets, setPetsState] = useState<Pet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPets = localStorage.getItem(STORAGE_KEYS.PETS);
        if (savedPets) {
          const parsed = JSON.parse(savedPets);
          if (Array.isArray(parsed)) return parsed.map(normalizePet);
        }
      } catch {}
    }
    return initialMockPets.map(normalizePet);
  });

  // 4. Favorites State
  const [favorites, setFavoritesState] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (savedFavorites) return JSON.parse(savedFavorites);
      } catch {}
    }
    return ['pet-1', 'pet-2'];
  });

  // 5. Applications State
  const [applications, setApplicationsState] = useState<PreAdoptionApplication[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        if (savedApps) return JSON.parse(savedApps);
      } catch {}
    }
    return initialApplications;
  });

  // 6. Toasts State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Theme synchronization with HTML .dark class
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Set Theme with persistence
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch {}
  }, []);

  // Set Current User with persistence
  const setCurrentUser = useCallback((user: CurrentUser | null) => {
    setCurrentUserState(user);
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, []);

  // Toasts
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  // Quick switch demo user
  const switchUser = useCallback((role: 'adopter' | 'guardian') => {
    if (role === 'adopter') {
      setCurrentUser(demoAdopter);
      showToast('Perfil alterado', 'Conectado como Adotante: Camila Rodrigues', 'info');
    } else {
      setCurrentUser(demoGuardian);
      showToast('Perfil alterado', 'Conectado como ONG: Patinhas com Amor', 'info');
    }
  }, [setCurrentUser, showToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    showToast('Sessão encerrada', 'Você saiu da sua conta.', 'info');
  }, [setCurrentUser, showToast]);

  // Pets Management
  const addPet = useCallback((newPetData: Omit<Pet, 'id' | 'createdAt'>) => {
    const rawPet = {
      ...newPetData,
      id: `pet-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const newPet = normalizePet(rawPet);
    setPetsState((prev) => {
      const updated = [newPet, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Animal cadastrado!', `${newPet.name} já está visível para adoção.`, 'success');
  }, [showToast]);

  const updatePet = useCallback((id: string, updates: Partial<Pet>) => {
    setPetsState((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Pet atualizado', 'As alterações foram salvas com sucesso.', 'success');
  }, [showToast]);

  const deletePet = useCallback((id: string) => {
    setPetsState((prev) => {
      const petToDelete = prev.find((p) => p.id === id);
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(updated));
      } catch {}
      showToast('Pet removido', `${petToDelete?.name || 'O animal'} foi removido do catálogo.`, 'info');
      return updated;
    });
  }, [showToast]);

  // Favorites
  const toggleFavorite = useCallback((petId: string) => {
    setFavoritesState((prev) => {
      const exists = prev.includes(petId);
      const updated = exists ? prev.filter((id) => id !== petId) : [...prev, petId];
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      } catch {}
      if (exists) {
        showToast('Removido dos favoritos', undefined, 'info');
      } else {
        showToast('Adicionado aos favoritos!', 'Você pode acompanhar seus pets favoritos.', 'success');
      }
      return updated;
    });
  }, [showToast]);

  const isFavorite = useCallback((petId: string) => {
    return favorites.includes(petId);
  }, [favorites]);

  // Business Rule 1: Age calculation & 21+ rule
  const calculateAge = useCallback((birthDate: string): number => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(0, age);
  }, []);

  const isAgeAllowed = useCallback((birthDate: string): boolean => {
    return calculateAge(birthDate) >= 21;
  }, [calculateAge]);

  // Deterministic Dossier Analysis Engine
  const analyzeDossier = useCallback((app: Partial<PreAdoptionApplication>): NonNullable<PreAdoptionApplication['automatedAnalysis']> => {
    let score = 70;
    const strengths: string[] = [];
    const attentionPoints: string[] = [];
    const suggestedQuestions: string[] = [];

    // Age rule check
    if (app.candidate?.birthDate) {
      const age = calculateAge(app.candidate.birthDate);
      if (age >= 21) {
        strengths.push(`Candidato com ${age} anos (acima da idade mínima de 21 anos).`);
        score += 5;
      } else {
        attentionPoints.push(`Candidato tem apenas ${age} anos. A política exige 21 anos completos.`);
        score -= 40;
      }
    }

    // Housing security
    if (app.housingType === 'apartamento') {
      if (app.hasProtection) {
        strengths.push('Apartamento totalmente protegido com telas de segurança em janelas e sacadas.');
        score += 15;
      } else {
        attentionPoints.push('Apartamento sem telas de proteção: risco gravíssimo de queda, especialmente para felinos.');
        score -= 35;
        suggestedQuestions.push('Você tem orçamento e autorização para instalar telas de proteção antes da chegada do animal?');
      }
    } else if (app.housingType === 'casa' || app.housingType === 'sobrado') {
      if (app.hasProtection) {
        strengths.push('Casa com muros altos e sem rotas de fuga ou acesso desacompanhado à rua.');
        score += 12;
      } else {
        attentionPoints.push('Casa sem comprovação de muros altos ou portão seguro: risco de fuga para a via pública.');
        score -= 20;
        suggestedQuestions.push('Como é a altura dos muros e o sistema do portão principal para evitar escapadas?');
      }
    }

    // Housing status
    if (app.housingStatus === 'proprio') {
      strengths.push('Imóvel próprio: maior estabilidade de moradia a longo prazo.');
      score += 5;
    } else if (app.housingStatus === 'alugado') {
      if (app.landlordPermission) {
        strengths.push('Imóvel alugado com autorização explícita do proprietário para animais.');
      } else {
        attentionPoints.push('Imóvel alugado sem autorização confirmada do locador ou regimento interno.');
        score -= 15;
        suggestedQuestions.push('O contrato de locação ou convenção condominial permite animais de estimação?');
      }
    }

    // Family agreement
    if (app.familyAgreement) {
      strengths.push('Unanimidade e concordância de todos os residentes sobre a chegada do novo pet.');
      score += 10;
    } else {
      attentionPoints.push('Falta de consenso de todos os moradores da casa sobre a adoção.');
      score -= 30;
      suggestedQuestions.push('Quais membros da casa têm ressalvas e como vocês pretendem alinhar a convivência?');
    }

    // Allergies
    if (app.allergyCases) {
      attentionPoints.push(`Histórico de alergia relatado na casa: ${app.allergyDetails || 'Necessita confirmação médica'}.`);
      score -= 10;
      suggestedQuestions.push('Como a pessoa alérgica reage ao contato e qual é o plano de manejo?');
    }

    // Time alone
    const hours = app.hoursAlone ?? 4;
    if (hours <= 4) {
      strengths.push(`Excelente presença: o animal ficará sozinho apenas ${hours}h por dia.`);
      score += 10;
    } else if (hours > 8) {
      attentionPoints.push(`Animal ficará sozinho por período prolongado (${hours}h/dia). Pode desenvolver ansiedade de separação.`);
      score -= 15;
      suggestedQuestions.push('Haverá brinquedos interativos, passeadores ou visitas na hora do almoço?');
    }

    // Vacation plan
    if (app.travelCarePlan && app.travelCarePlan.trim().length > 15) {
      strengths.push('Plano estruturado e responsável de acolhimento durante viagens e férias.');
      score += 5;
    } else {
      attentionPoints.push('Plano de viagens vago ou não detalhado.');
      suggestedQuestions.push('O que você planeja fazer com o pet durante períodos de viagem prolongada?');
    }

    // Financial awareness
    if (app.costAwareness) {
      strengths.push('Consciência declarada dos custos contínuos (ração de qualidade, vacinas anuais e emergências).');
      score += 5;
    } else {
      attentionPoints.push('Não confirmou ciência dos custos e imprevistos veterinários.');
      score -= 20;
    }

    // Existing pets
    if (app.hasCurrentPets) {
      strengths.push('Já convive com outros animais de estimação.');
      suggestedQuestions.push('Como seus animais atuais reagem na aproximação de novos companheiros?');
    }

    // Final score clamp
    const finalScore = Math.min(100, Math.max(10, score));

    let verdict = 'Recomendada com Observações';
    if (finalScore >= 85) {
      verdict = 'Altamente Recomendada';
    } else if (finalScore >= 70) {
      verdict = 'Recomendada com Adaptação';
    } else if (finalScore >= 50) {
      verdict = 'Necessita Entrevista Aprofundada';
    } else {
      verdict = 'Não Recomendada (Risco de Incompatibilidade)';
    }

    return {
      suitabilityScore: finalScore,
      verdict,
      strengths,
      attentionPoints,
      suggestedQuestions: suggestedQuestions.slice(0, 3)
    };
  }, [calculateAge]);

  // Deterministic SmartMatch Algorithm
  const calculateSmartMatch = useCallback((quiz: SmartMatchQuizData, pet: Pet): MatchResult => {
    let score = 75;
    const matchedReasons: string[] = [];
    const adaptationTips: string[] = [];

    // Species preference
    if (quiz.preferredSpecies !== 'all') {
      if (pet.species === quiz.preferredSpecies) {
        score += 15;
        matchedReasons.push(`Corresponde à espécie desejada (${pet.species === 'dog' ? 'Cachorro' : 'Gato'}).`);
      } else {
        score -= 25;
      }
    }

    // Housing & Species
    if (pet.species === 'cat') {
      if (quiz.hasProtection) {
        score += 15;
        matchedReasons.push('Moradia com telas seguras: ambiente perfeito para felinos.');
      } else {
        score -= 30;
        adaptationTips.push('Instalação de telas nas janelas é requisito obrigatório antes de receber este gatinho.');
      }
    }

    // Size vs Housing
    if (pet.size === 'large') {
      if (quiz.housingType === 'apartamento') {
        score -= 10;
        adaptationTips.push('Por ser de grande porte, necessita de passeios diários regulares para gastar energia.');
      } else {
        score += 10;
        matchedReasons.push('Imóvel espaçoso ideal para cão de grande porte.');
      }
    }

    // Size preference
    if (quiz.preferredSize !== 'all') {
      if (pet.size === quiz.preferredSize) {
        score += 10;
        matchedReasons.push('Porte ideal para sua expectativa.');
      } else {
        score -= 10;
      }
    }

    // Energy & Hours alone
    if (quiz.hoursAlone > 6) {
      if (pet.ageCategory === 'senior' || pet.temperament.includes('Calma') || pet.temperament.includes('Tranquilo')) {
        score += 12;
        matchedReasons.push('Temperamento tranquilo e maduro, lida melhor com períodos de tranquilidade na casa.');
      } else if (pet.ageCategory === 'puppy') {
        score -= 20;
        adaptationTips.push('Filhotes demandam supervisão frequente e podem chorar se ficarem sozinhos por muito tempo.');
      }
    } else {
      score += 8;
      matchedReasons.push('Sua presença diária favorece uma adaptação rápida e acolhedora.');
    }

    // Children
    if (quiz.hasChildren) {
      if (pet.temperament.includes('Dócil') || pet.temperament.includes('Brincalhão') || pet.temperament.includes('Gentil')) {
        score += 12;
        matchedReasons.push('Histórico muito positivo de paciência e afeto com crianças.');
      } else {
        adaptationTips.push('Recomenda-se aproximação gradual e supervisão inicial das crianças com o pet.');
      }
    }

    // Other pets
    if (quiz.hasOtherPets) {
      if (pet.temperament.includes('Sociável') || pet.temperament.includes('Companheiro')) {
        score += 10;
        matchedReasons.push('Sociável com outros animais de estimação.');
      } else {
        adaptationTips.push('Faça uma apresentação com reforço positivo e cheiros trocados nos primeiros dias.');
      }
    }

    // Energy compatibility
    if (quiz.energyLevel === 'high' && (pet.temperament.includes('Brincalhão') || pet.size === 'large')) {
      score += 10;
      matchedReasons.push('Nível de energia alinhado com suas atividades e passeios.');
    } else if (quiz.energyLevel === 'calm' && (pet.temperament.includes('Calma') || pet.temperament.includes('Tranquila') || pet.ageCategory === 'senior')) {
      score += 12;
      matchedReasons.push('Ideal para rotinas tranquilas e momentos relaxantes.');
    }

    const finalScore = Math.min(99, Math.max(35, score));
    const level = finalScore >= 80 ? 'high' : finalScore >= 65 ? 'medium' : 'moderate';

    if (adaptationTips.length === 0) {
      adaptationTips.push('Ofereça um cantinho aconchegante com caminha e brinquedos desde o primeiro dia.');
    }

    return {
      pet,
      score: finalScore,
      compatibilityLevel: level,
      matchedReasons: matchedReasons.slice(0, 3),
      adaptationTips: adaptationTips.slice(0, 2)
    };
  }, []);

  // Applications
  const submitApplication = useCallback((data: Omit<PreAdoptionApplication, 'id' | 'createdAt' | 'status' | 'notes' | 'messages' | 'automatedAnalysis'>): PreAdoptionApplication => {
    const analysis = analyzeDossier(data);
    const newApp: PreAdoptionApplication = {
      ...data,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      notes: ['Candidatura submetida através do ConnectPet.'],
      guardianNotes: '',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: data.candidate.name,
          senderRole: 'adopter',
          content: `Olá! Acabei de enviar minha candidatura para adotar ${data.petName}. Fico à disposição para conversar e agendar uma visita!`,
          sentAt: new Date().toISOString()
        }
      ],
      automatedAnalysis: analysis
    };

    setApplicationsState((prev) => {
      const updated = [newApp, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Mark pet as in_process
    setPetsState((prev) => {
      const updated = prev.map((p) => (p.id === data.petId ? { ...p, status: 'in_process' as const } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast('Candidatura enviada!', `Seu dossiê para adotar ${data.petName} foi recebido pela ONG.`, 'success');
    return newApp;
  }, [analyzeDossier, showToast]);

  const updateApplicationStatus = useCallback((appId: string, status: ApplicationStatus) => {
    setApplicationsState((prev) => {
      const updated = prev.map((app) => {
        if (app.id === appId) {
          const statusLabels: Record<ApplicationStatus, string> = {
            pending: 'Pendente',
            under_review: 'Em Avaliação',
            approved: 'Aprovada',
            rejected: 'Não Aprovada',
            completed: 'Adoção Concluída'
          };
          const systemMsg = {
            id: `sys-${Date.now()}`,
            senderName: 'Sistema ConnectPet',
            senderRole: 'system' as const,
            content: `Status da candidatura alterado para: ${statusLabels[status]}.`,
            sentAt: new Date().toISOString()
          };
          return {
            ...app,
            status,
            messages: [...app.messages, systemMsg]
          };
        }
        return app;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Status atualizado', 'O andamento da candidatura foi atualizado com sucesso.', 'success');
  }, [showToast]);

  const updateGuardianNotes = useCallback((appId: string, notes: string) => {
    setApplicationsState((prev) => {
      const updated = prev.map((app) => (app.id === appId ? { ...app, guardianNotes: notes } : app));
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Nota salva', 'Anotações internas da ONG atualizadas.', 'info');
  }, [showToast]);

  const sendApplicationMessage = useCallback((appId: string, content: string) => {
    if (!content.trim()) return;

    setApplicationsState((prev) => {
      const updated = prev.map((app) => {
        if (app.id === appId) {
          const isAdopter = currentUser?.role === 'adopter';
          const senderName = currentUser?.name || (isAdopter ? 'Candidato' : 'Protetor');
          const senderRole = isAdopter ? ('adopter' as const) : ('guardian' as const);

          const newMessage = {
            id: `msg-${Date.now()}`,
            senderName,
            senderRole,
            content: content.trim(),
            sentAt: new Date().toISOString()
          };

          return {
            ...app,
            messages: [...app.messages, newMessage]
          };
        }
        return app;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Mensagem enviada', undefined, 'success');
  }, [currentUser, showToast]);

  const contextValue = useMemo<AppContextType>(() => ({
    theme,
    setTheme,
    currentUser,
    setCurrentUser,
    switchUser,
    logout,
    pets,
    addPet,
    updatePet,
    deletePet,
    favorites,
    toggleFavorite,
    isFavorite,
    applications,
    submitApplication,
    updateApplicationStatus,
    updateGuardianNotes,
    sendApplicationMessage,
    toasts,
    showToast,
    removeToast,
    calculateAge,
    isAgeAllowed,
    analyzeDossier,
    calculateSmartMatch,
  }), [
    theme,
    setTheme,
    currentUser,
    setCurrentUser,
    switchUser,
    logout,
    pets,
    addPet,
    updatePet,
    deletePet,
    favorites,
    toggleFavorite,
    isFavorite,
    applications,
    submitApplication,
    updateApplicationStatus,
    updateGuardianNotes,
    sendApplicationMessage,
    toasts,
    showToast,
    removeToast,
    calculateAge,
    isAgeAllowed,
    analyzeDossier,
    calculateSmartMatch,
  ]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
