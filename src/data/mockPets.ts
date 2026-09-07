import { Pet, AdopterProfile, GuardianProfile, PreAdoptionApplication } from '../types';

export const demoAdopter: AdopterProfile = {
  id: 'adopter-camila-1',
  role: 'adopter',
  name: 'Camila Rodrigues',
  cpf: '348.912.875-01',
  rg: '44.892.112-X',
  birthDate: '1997-04-15', // 28 anos (aprovado na regra 21+)
  primaryPhone: '(11) 98765-4321',
  secondaryPhone: '(11) 3214-5678',
  email: 'camila.rodrigues.arq@gmail.com',
  profession: 'Arquiteta e Urbanista',
  socialMedia: '@camila.arq.design',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
};

export const demoGuardian: GuardianProfile = {
  id: 'guardian-patinhas-1',
  role: 'guardian',
  guardianType: 'ngo',
  name: 'ONG Patinhas com Amor',
  responsibleName: 'Dra. Helena Silveira',
  document: '32.184.902/0001-45',
  email: 'contato@patinhascomamor.org.br',
  primaryPhone: '(11) 97123-9988',
  city: 'São Paulo',
  state: 'SP',
  neighborhood: 'Vila Mariana',
  description: 'Instituição sem fins lucrativos dedicada ao resgate, reabilitação e encaminhamento responsável de cães e gatos em situação de vulnerabilidade.',
  bio: 'Mais de 1.200 vidas transformadas desde 2018. Cada animal é castrado, microchipado, vacinado e acolhido em lar temporário com amor.',
  verified: true,
  avatar: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=400&auto=format&fit=crop',
};

export const mockPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Thor',
    species: 'dog',
    breed: 'Vira-lata (SRD) Caramelo',
    size: 'medium',
    approximateAge: '2 anos',
    ageCategory: 'young',
    sex: 'male',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'V8/V10 completa e Antirrábica em dia (atualizada em 01/2026).',
    specialNeeds: 'Nenhuma. Animal atlético e muito saudável.',
    photos: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Carinhoso, brincalhão e um companheiro leal para todas as horas.',
    story: 'Thor foi resgatado em uma avenida movimentada durante uma noite chuvosa. Estava assustado, mas após receber acolhimento e tratamento veterinário, revelou uma personalidade dócil, cheia de gratidão e energia para passeios ao ar livre.',
    temperament: ['Dócil', 'Brincalhão', 'Sociável', 'Companheiro'],
    temperamentDescription: 'Adora brincadeiras com bolinha e passeios no parque. Convive pacificamente com outros cães e adora a companhia de pessoas.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana'
    },
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês Mestiço',
    size: 'small',
    approximateAge: '1 ano',
    ageCategory: 'young',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'Quádrupla Felina (V4) e Antirrábica aplicadas.',
    specialNeeds: 'Exige moradia 100% telada em janelas e sacadas para segurança felina.',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Ronronadora profissional, calma e extremamente amorosa.',
    story: 'Luna nasceu em uma ninhada resgatada em um estacionamento. Desde filhote convive em lar temporário com humanos atenciosos, tornando-se muito apegada a colo e carinho na barriguinha.',
    temperament: ['Calma', 'Carinhosa', 'Curiosa', 'Acolhedora'],
    temperamentDescription: 'Silenciosa e educada, acostumada com caixa de areia fechada e arranhadores de sisal. Ideal para quem busca tranquilidade.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana'
    },
    createdAt: '2026-02-12T14:30:00Z'
  },
  {
    id: 'pet-3',
    name: 'Pipoca',
    species: 'dog',
    breed: 'Porte Pequeno Mestiço',
    size: 'small',
    approximateAge: '5 meses',
    ageCategory: 'puppy',
    sex: 'female',
    status: 'in_process',
    vaccinated: true,
    castrated: false,
    dewormed: true,
    vaccinationDetails: '2 doses de V10 tomadas. Castração já agendada e custeada pela ONG aos 6 meses.',
    specialNeeds: 'Ainda em fase de aprendizado de necessidades no tapete higiênico.',
    photos: [
      'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Uma explosão de fofura e alegria que cabe no seu colo.',
    story: 'Pipoca foi encontrada dentro de uma caixa com seus irmãozinhos em frente a uma clínica veterinária parceira. É saudável, cheia de vitalidade e apaixonada por brinquedos de morder.',
    temperament: ['Alegre', 'Curiosa', 'Inteligente', 'Afetuosa'],
    temperamentDescription: 'Aprende comandos básicos muito rápido com reforço positivo. Adora dormir perto dos seus tutores.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Pinheiros'
    },
    createdAt: '2026-02-18T09:15:00Z'
  },
  {
    id: 'pet-4',
    name: 'Bartô',
    species: 'dog',
    breed: 'Labrador Mestiço',
    size: 'large',
    approximateAge: '3 anos',
    ageCategory: 'adult',
    sex: 'male',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'Vacinação anual completa e vermifugação atualizada.',
    specialNeeds: 'Necessita de quintal espaçoso ou tutores com rotina ativa de caminhadas.',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Gentil gigante, protetor da família e ótimo com crianças.',
    story: 'Bartô foi entregue após a família anterior se mudar para o exterior sem planejamento pet. Sofreu um pouco no início com a separação, mas hoje está radiante, confiante e pronto para retribuir dedicação com fidelidade incondicional.',
    temperament: ['Gentil', 'Protetor', 'Brincalhão', 'Equilibrado'],
    temperamentDescription: 'Paciência exemplar com crianças. Convive bem com outros animais e adora brincadeiras na água.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Morumbi'
    },
    createdAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'pet-5',
    name: 'Mel',
    species: 'cat',
    breed: 'Tricolor da Sorte',
    size: 'small',
    approximateAge: '4 anos',
    ageCategory: 'adult',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'V5 Quíntupla Felina com teste negativo para FIV/FeLV.',
    specialNeeds: 'Apartamento telado e ambiente calmo.',
    photos: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Olhar penetrante, dócil, independente e muito tranquila.',
    story: 'Mel vivia em uma comunidade e foi resgatada prenha pela equipe da ONG. Seus gatinhos já foram todos adotados com segurança e agora é a vez dela de ter um lar definitivo cheio de conforto.',
    temperament: ['Tranquila', 'Independente', 'Carinhosa', 'Silenciosa'],
    temperamentDescription: 'Gosta de banhos de sol perto da janela protegida e de cochilar nos pés da cama.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana'
    },
    createdAt: '2026-01-25T16:20:00Z'
  },
  {
    id: 'pet-6',
    name: 'Frederico',
    species: 'dog',
    breed: 'Beagle Mestiço',
    size: 'medium',
    approximateAge: '8 anos',
    ageCategory: 'senior',
    sex: 'male',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'Check-up geriátrico recente impecável, vacinas 100% atualizadas.',
    specialNeeds: 'Ração para cães sênior e caminhadas leves a moderadas.',
    photos: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Um sábio companheiro sênior que valoriza a paz de um lar amoroso.',
    story: 'Seu antigo tutor idoso faleceu e os parentes não puderam acolhê-lo. Frederico é educado, não rói objetos e sabe andar na guia perfeitamente. Adotar um idosinho é um ato sublime de generosidade.',
    temperament: ['Dócil', 'Tranquilo', 'Educado', 'Agradecido'],
    temperamentDescription: 'Muito calmo, quase não late, adora um carinho nas orelhas e é extremamente leal.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana'
    },
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'pet-7',
    name: 'Nina',
    species: 'cat',
    breed: 'Frajolinha Charmosa',
    size: 'small',
    approximateAge: '7 meses',
    ageCategory: 'puppy',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'V4 e Antirrábica aplicadas, vermifugada.',
    specialNeeds: 'Imprescindível moradia com janelas e sacadas devidamente teladas.',
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Energia jovem, olhar curioso e muita vontade de interagir.',
    story: 'Nina foi resgatada debaixo do capô de um carro. Curada e castrada, revelou uma simpatia irresistível e busca um lar seguro com humanos carinhosos.',
    temperament: ['Curiosa', 'Brincalhona', 'Afetuosa', 'Sociável'],
    temperamentDescription: 'Adora perseguir varinhas com penas e dormir enroladinha em mantas macias.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana'
    },
    createdAt: '2026-02-20T12:00:00Z'
  },
  {
    id: 'pet-8',
    name: 'Amora',
    species: 'dog',
    breed: 'Pastor Mestiço Fêmea',
    size: 'medium',
    approximateAge: '1 ano e meio',
    ageCategory: 'young',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccinationDetails: 'V10 múltipla e Antirrábica em dia.',
    specialNeeds: 'Nenhuma. Animal extremamente inteligente e obediente.',
    photos: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Inteligência fora do comum, foco e amor incondicional.',
    story: 'Amora foi encontrada abandonada em um terreno baldio ainda jovem. Demonstrou incrível capacidade de aprendizado e facilidade para conviver com outros cães em seu lar temporário.',
    temperament: ['Inteligente', 'Leal', 'Atenta', 'Dócil'],
    temperamentDescription: 'Excelente em comandos de obediência básica, adora passear no parque e é muito atenta à voz do tutor.',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    guardianPhone: '(11) 97123-9988',
    guardianEmail: 'contato@patinhascomamor.org.br',
    location: {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Mariana'
    },
    createdAt: '2026-02-05T15:00:00Z'
  }
];

export const initialApplications: PreAdoptionApplication[] = [
  {
    id: 'app-camila-thor',
    petId: 'pet-1',
    petName: 'Thor',
    petPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop',
    petSpecies: 'dog',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    candidateId: 'adopter-camila-1',
    candidate: {
      name: 'Camila Rodrigues',
      birthDate: '1997-04-15',
      profession: 'Arquiteta e Urbanista',
      primaryPhone: '(11) 98765-4321',
      email: 'camila.rodrigues.arq@gmail.com',
      socialMedia: '@camila.arq.design',
      cpf: '348.912.875-01',
      rg: '44.892.112-X'
    },
    housingType: 'apartamento',
    housingStatus: 'proprio',
    landlordPermission: true,
    hasProtection: true,
    protectionDetails: 'Apartamento com 95m², telas de proteção de 5cm instaladas em todas as janelas e na sacada envidraçada.',
    accessArea: 'livre_total',
    adultsCount: 2,
    childrenCount: 0,
    familyAgreement: true,
    allergyCases: false,
    hoursAlone: 4,
    travelCarePlan: 'Em viagens, o Thor ficará com meus pais que têm sítio seguro ou contrataremos pet sitter de confiança já conhecida.',
    hasCurrentPets: false,
    previousPetsHistory: 'Tive um cão mestiço (Bob) por 14 anos na infância/adolescência, tratado com todo o cuidado veterinário até seu falecimento natural de velhice.',
    costAwareness: true,
    status: 'under_review',
    createdAt: '2026-03-01T14:20:00Z',
    notes: ['Candidata enviou fotos das telas de proteção.', 'Excelente estabilidade e histórico.'],
    guardianNotes: 'Perfil exemplar. Camila trabalha híbrido (3 dias home office). Janelas totalmente teladas.',
    messages: [
      {
        id: 'msg-1',
        senderName: 'Camila Rodrigues',
        senderRole: 'adopter',
        content: 'Olá equipe da Patinhas com Amor! Estou muito ansiosa para conhecer o Thor. As fotos do meu apartamento telado já estão separadas se precisarem.',
        sentAt: '2026-03-01T14:25:00Z'
      },
      {
        id: 'msg-2',
        senderName: 'Dra. Helena Silveira (ONG)',
        senderRole: 'guardian',
        content: 'Olá Camila! Seu formulário foi avaliado com louvor pelo nosso comitê. O Thor é muito amoroso e tem tudo a ver com o seu perfil. Podemos agendar uma visita presencial para este sábado às 10h?',
        sentAt: '2026-03-01T16:10:00Z'
      },
      {
        id: 'msg-3',
        senderName: 'Camila Rodrigues',
        senderRole: 'adopter',
        content: 'Perfeito, Dra. Helena! Sábado às 10h estarei aí com certeza. Muito obrigada pelo carinho!',
        sentAt: '2026-03-01T16:45:00Z'
      }
    ],
    automatedAnalysis: {
      suitabilityScore: 96,
      verdict: 'Altamente Recomendada',
      strengths: [
        'Idade superior a 21 anos (28 anos) com renda e residência própria.',
        'Imóvel 100% telado em janelas e sacada.',
        'Rotina favorável: animal ficará sozinho apenas 4 horas por dia.',
        'Total concordância familiar e planejamento de viagens estruturado.',
        'Consciência explícita sobre custos e emergências veterinárias.'
      ],
      attentionPoints: [
        'Primeiro pet no imóvel atual (embora tenha tido cão por 14 anos na família).'
      ],
      suggestedQuestions: [
        'Como você pretende estruturar a rotina de passeios nos dias em que for ao escritório presencial?',
        'O condomínio possui área de passeio ou pet place?'
      ]
    }
  },
  {
    id: 'app-lucas-pipoca',
    petId: 'pet-3',
    petName: 'Pipoca',
    petPhoto: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1000&auto=format&fit=crop',
    petSpecies: 'dog',
    guardianId: 'guardian-patinhas-1',
    guardianName: 'ONG Patinhas com Amor',
    guardianType: 'ngo',
    candidateId: 'adopter-lucas-2',
    candidate: {
      name: 'Lucas Mendes',
      birthDate: '1995-11-20',
      profession: 'Desenvolvedor de Software',
      primaryPhone: '(11) 97654-1234',
      email: 'lucas.mendes.dev@gmail.com',
      socialMedia: '@lucas.dev',
      cpf: '219.837.461-90',
      rg: '38.192.341-2'
    },
    housingType: 'casa',
    housingStatus: 'proprio',
    hasProtection: true,
    protectionDetails: 'Casa com muros de 2,40m e portão fechado sem vãos de fuga.',
    accessArea: 'livre_total',
    adultsCount: 2,
    childrenCount: 1,
    familyAgreement: true,
    allergyCases: false,
    hoursAlone: 2,
    travelCarePlan: 'Temos familiares que moram na mesma rua e adoram animais.',
    hasCurrentPets: true,
    currentPetsDetails: [
      {
        species: 'Cão SRD',
        age: '4 anos',
        sex: 'Fêmea',
        castrated: true,
        vaccinated: true
      }
    ],
    previousPetsHistory: 'Sempre tivemos cães castrados e vacinados.',
    costAwareness: true,
    status: 'pending',
    createdAt: '2026-03-02T10:15:00Z',
    notes: ['Candidatura nova aguardando contato inicial.'],
    guardianNotes: 'Família com criança pequena (6 anos). Checar adaptação da Pipoca.',
    messages: [
      {
        id: 'msg-lucas-1',
        senderName: 'Lucas Mendes',
        senderRole: 'adopter',
        content: 'Boa tarde! Nossa filha de 6 anos sonha com uma irmãzinha de 4 patas para a nossa cachorrinha Belinha. A Pipoca se dá bem com crianças?',
        sentAt: '2026-03-02T10:18:00Z'
      }
    ],
    automatedAnalysis: {
      suitabilityScore: 92,
      verdict: 'Recomendada com Adaptação',
      strengths: [
        'Muros altos e seguros (2,40m) sem rota de fuga.',
        'Animal anterior já castrado e vacinado (histórico positivo de tutela responsável).',
        'Trabalho remoto, animal fica acompanhado praticamente o dia todo.',
        'Consciência de custos.'
      ],
      attentionPoints: [
        'Presença de criança pequena: orientar sobre manejo delicado com filhotes.',
        'Socialização gradual necessária com o cão residente.'
      ],
      suggestedQuestions: [
        'Como a Belinha (cão atual) reage quando encontra outros cães?',
        'A criança já foi orientada sobre não perturbar o filhote durante alimentação e sono?'
      ]
    }
  }
];
