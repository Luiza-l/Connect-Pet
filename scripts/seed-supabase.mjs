import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockPets = [
  {
    name: 'Thor',
    species: 'dog',
    breed: 'Vira-lata (SRD) Caramelo',
    size: 'medium',
    approximate_age: '2 anos',
    age_category: 'young',
    sex: 'male',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'V8/V10 completa e Antirrábica em dia (atualizada em 01/2026).',
    special_needs: 'Nenhuma. Animal atlético e muito saudável.',
    photos: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Carinhoso, brincalhão e um companheiro leal para todas as horas.',
    story: 'Thor foi resgatado em uma avenida movimentada durante uma noite chuvosa. Estava assustado, mas após receber acolhimento e tratamento veterinário, revelou uma personalidade dócil, cheia de gratidão e energia para passeios ao ar livre.',
    temperament: ['Dócil', 'Brincalhão', 'Sociável', 'Companheiro'],
    temperament_description: 'Adora brincadeiras com bolinha e passeios no parque. Convive pacificamente com outros cães e adora a companhia de pessoas.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana'
  },
  {
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês Mestiço',
    size: 'small',
    approximate_age: '1 ano',
    age_category: 'young',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'Quádrupla Felina (V4) e Antirrábica aplicadas.',
    special_needs: 'Exige moradia 100% telada em janelas e sacadas para segurança felina.',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Ronronadora profissional, calma e extremamente amorosa.',
    story: 'Luna nasceu em uma ninhada resgatada em um estacionamento. Desde filhote convive em lar temporário com humanos atenciosos, tornando-se muito apegada a colo e carinho na barriguinha.',
    temperament: ['Calma', 'Carinhosa', 'Curiosa', 'Acolhedora'],
    temperament_description: 'Silenciosa e educada, acostumada com caixa de areia fechada e arranhadores de sisal. Ideal para quem busca tranquilidade.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana'
  },
  {
    name: 'Pipoca',
    species: 'dog',
    breed: 'Porte Pequeno Mestiço',
    size: 'small',
    approximate_age: '5 meses',
    age_category: 'puppy',
    sex: 'female',
    status: 'in_process',
    vaccinated: true,
    castrated: false,
    dewormed: true,
    vaccination_details: '2 doses de V10 tomadas. Castração já agendada e custeada pela ONG aos 6 meses.',
    special_needs: 'Ainda em fase de aprendizado de necessidades no tapete higiênico.',
    photos: [
      'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Uma explosão de fofura e alegria que cabe no seu colo.',
    story: 'Pipoca foi encontrada dentro de uma caixa com seus irmãozinhos em frente a uma clínica veterinária parceira. É saudável, cheia de vitalidade e apaixonada por brinquedos de morder.',
    temperament: ['Alegre', 'Curiosa', 'Inteligente', 'Afetuosa'],
    temperament_description: 'Aprende comandos básicos muito rápido com reforço positivo. Adora dormir perto dos seus tutores.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros'
  },
  {
    name: 'Bartô',
    species: 'dog',
    breed: 'Labrador Mestiço',
    size: 'large',
    approximate_age: '3 anos',
    age_category: 'adult',
    sex: 'male',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'Vacinação anual completa e vermifugação atualizada.',
    special_needs: 'Necessita de quintal espaçoso ou tutores com rotina ativa de caminhadas.',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Gentil gigante, protetor da família e ótimo com crianças.',
    story: 'Bartô foi entregue após a família anterior se mudar para o exterior sem planejamento pet. Sofreu um pouco no início com a separação, mas hoje está radiante, confiante e pronto para retribuir dedicação com fidelidade incondicional.',
    temperament: ['Gentil', 'Protetor', 'Brincalhão', 'Equilibrado'],
    temperament_description: 'Paciência exemplar com crianças. Convive bem com outros animais e adora brincadeiras na água.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Morumbi'
  },
  {
    name: 'Mel',
    species: 'cat',
    breed: 'Tricolor da Sorte',
    size: 'small',
    approximate_age: '4 anos',
    age_category: 'adult',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'V5 Quíntupla Felina com teste negativo para FIV/FeLV.',
    special_needs: 'Apartamento telado e ambiente calmo.',
    photos: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Olhar penetrante, dócil, independente e muito tranquila.',
    story: 'Mel vivia em uma comunidade e foi resgatada prenha pela equipe da ONG. Seus gatinhos já foram todos adotados com segurança e agora é a vez dela de ter um lar definitivo cheio de conforto.',
    temperament: ['Tranquila', 'Independente', 'Carinhosa', 'Silenciosa'],
    temperament_description: 'Gosta de banhos de sol perto da janela protegida e de cochilar nos pés da cama.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana'
  },
  {
    name: 'Frederico',
    species: 'dog',
    breed: 'Beagle Mestiço',
    size: 'medium',
    approximate_age: '8 anos',
    age_category: 'senior',
    sex: 'male',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'Check-up geriátrico recente impecável, vacinas 100% atualizadas.',
    special_needs: 'Ração para cães sênior e caminhadas leves a moderadas.',
    photos: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Um sábio companheiro sênior que valoriza a paz de um lar amoroso.',
    story: 'Seu antigo tutor idoso faleceu e os parentes não puderam acolhê-lo. Frederico é educado, não rói objetos e sabe andar na guia perfeitamente. Adotar um idosinho é um ato sublime de generosidade.',
    temperament: ['Dócil', 'Tranquilo', 'Educado', 'Agradecido'],
    temperament_description: 'Muito calmo, quase não late, adora um carinho nas orelhas e é extremamente leal.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana'
  },
  {
    name: 'Nina',
    species: 'cat',
    breed: 'Frajolinha Charmosa',
    size: 'small',
    approximate_age: '7 meses',
    age_category: 'puppy',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'V4 e Antirrábica aplicadas, vermifugada.',
    special_needs: 'Imprescindível moradia com janelas e sacadas devidamente teladas.',
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Energia jovem, olhar curioso e muita vontade de interagir.',
    story: 'Nina foi resgatada debaixo do capô de um carro. Curada e castrada, revelou uma simpatia irresistível e busca um lar seguro com humanos carinhosos.',
    temperament: ['Curiosa', 'Brincalhona', 'Afetuosa', 'Sociável'],
    temperament_description: 'Adora perseguir varinhas com penas e dormir enroladinha em mantas macias.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana'
  },
  {
    name: 'Amora',
    species: 'dog',
    breed: 'Pastor Mestiço Fêmea',
    size: 'medium',
    approximate_age: '1 ano e meio',
    age_category: 'young',
    sex: 'female',
    status: 'available',
    vaccinated: true,
    castrated: true,
    dewormed: true,
    vaccination_details: 'V10 múltipla e Antirrábica em dia.',
    special_needs: 'Nenhuma. Animal extremamente inteligente e obediente.',
    photos: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000&auto=format&fit=crop'
    ],
    headline: 'Inteligência fora do comum, foco e amor incondicional.',
    story: 'Amora foi encontrada abandonada em um terreno baldio ainda jovem. Demonstrou incrível capacidade de aprendizado e facilidade para conviver com outros cães em seu lar temporário.',
    temperament: ['Inteligente', 'Leal', 'Atenta', 'Dócil'],
    temperament_description: 'Excelente em comandos de obediência básica, adora passear no parque e é muito atenta à voz do tutor.',
    guardian_id: 'guardian-patinhas-1',
    guardian_name: 'ONG Patinhas com Amor',
    guardian_type: 'ngo',
    guardian_phone: '(11) 97123-9988',
    guardian_email: 'contato@patinhascomamor.org.br',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana'
  }
];

async function seed() {
  console.log('--- Iniciando Seed do Supabase ---');

  // 1. Check existing pets
  const { data: existingPets, error: checkError } = await supabase
    .from('pets')
    .select('id, name');

  if (checkError) {
    console.error('Erro ao verificar pets existentes:', checkError);
    return;
  }

  let petsMap = {};

  if (existingPets && existingPets.length > 0) {
    console.log(`Pets já existem no banco (${existingPets.length} encontrados).`);
    existingPets.forEach(p => {
      petsMap[p.name] = p.id;
    });
  } else {
    console.log('Inserindo 8 pets no Supabase...');
    const { data: insertedPets, error: insertPetsError } = await supabase
      .from('pets')
      .insert(mockPets)
      .select();

    if (insertPetsError) {
      console.error('Erro ao inserir pets:', insertPetsError);
      return;
    }

    console.log(`Sucesso! ${insertedPets.length} pets inseridos no Supabase.`);
    insertedPets.forEach(p => {
      petsMap[p.name] = p.id;
    });
  }

  // 2. Check and Seed Applications
  const { data: camilaApp } = await supabase
    .from('applications')
    .select('id')
    .eq('candidate_name', 'Camila Rodrigues')
    .limit(1);

  if (camilaApp && camilaApp.length > 0) {
    console.log('Candidatura da Camila já existe no banco.');
  } else {
    console.log('Inserindo candidaturas iniciais (Camila e Lucas)...');

    const thorId = petsMap['Thor'] || null;
    const pipocaId = petsMap['Pipoca'] || null;

    // App 1: Camila -> Thor
    const { data: app1Data, error: app1Err } = await supabase
      .from('applications')
      .insert({
        pet_id: thorId,
        candidate_name: 'Camila Rodrigues',
        candidate_email: 'camila.rodrigues.arq@gmail.com',
        candidate_phone: '(11) 98765-4321',
        guardian_id: 'guardian-patinhas-1',
        status: 'under_review',
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
        housing: {
          housingType: 'apartamento',
          housingStatus: 'proprio',
          landlordPermission: true,
          hasProtection: true,
          protectionDetails: 'Apartamento com 95m², telas de proteção de 5cm instaladas em todas as janelas e na sacada envidraçada.',
          accessArea: 'livre_total'
        },
        routine: {
          adultsCount: 2,
          childrenCount: 0,
          familyAgreement: true,
          allergyCases: false,
          hoursAlone: 4,
          travelCarePlan: 'Em viagens, o Thor ficará com meus pais que têm sítio seguro ou contrataremos pet sitter de confiança já conhecida.',
          hasCurrentPets: false,
          previousPetsHistory: 'Tive um cão mestiço (Bob) por 14 anos na infância/adolescência, tratado com todo o cuidado veterinário até seu falecimento natural de velhice.'
        },
        finance: {
          costAwareness: true
        },
        dossier: {
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
        automated_analysis: {
          suitabilityScore: 96,
          verdict: 'Altamente Recomendada'
        },
        guardian_notes: 'Perfil exemplar. Camila trabalha híbrido (3 dias home office). Janelas totalmente teladas.'
      })
      .select();

    if (app1Err) {
      console.error('Erro ao inserir App 1:', app1Err);
    } else if (app1Data && app1Data[0]) {
      const app1Id = app1Data[0].id;
      console.log('App 1 criada com ID:', app1Id);

      // Inserir mensagens da App 1
      await supabase.from('application_messages').insert([
        {
          application_id: app1Id,
          sender_id: 'adopter-camila-1',
          sender_name: 'Camila Rodrigues',
          sender_role: 'candidate',
          message: 'Olá equipe da Patinhas com Amor! Estou muito ansiosa para conhecer o Thor. As fotos do meu apartamento telado já estão separadas se precisarem.'
        },
        {
          application_id: app1Id,
          sender_id: 'guardian-patinhas-1',
          sender_name: 'Dra. Helena Silveira (ONG)',
          sender_role: 'guardian',
          message: 'Olá Camila! Seu formulário foi avaliado com louvor pelo nosso comitê. O Thor é muito amoroso e tem tudo a ver com o seu perfil. Podemos agendar uma visita presencial para este sábado às 10h?'
        },
        {
          application_id: app1Id,
          sender_id: 'adopter-camila-1',
          sender_name: 'Camila Rodrigues',
          sender_role: 'candidate',
          message: 'Perfeito, Dra. Helena! Sábado às 10h estarei aí com certeza. Muito obrigada pelo carinho!'
        }
      ]);
      console.log('Mensagens da App 1 inseridas.');
    }

    // App 2: Lucas -> Pipoca
    const { data: app2Data, error: app2Err } = await supabase
      .from('applications')
      .insert({
        pet_id: pipocaId,
        candidate_name: 'Lucas Mendes',
        candidate_email: 'lucas.mendes.dev@gmail.com',
        candidate_phone: '(11) 97654-1234',
        guardian_id: 'guardian-patinhas-1',
        status: 'pending',
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
        housing: {
          housingType: 'casa',
          housingStatus: 'proprio',
          hasProtection: true,
          protectionDetails: 'Casa com muros de 2,40m e portão fechado sem vãos de fuga.',
          accessArea: 'livre_total'
        },
        routine: {
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
          previousPetsHistory: 'Sempre tivemos cães castrados e vacinados.'
        },
        finance: {
          costAwareness: true
        },
        dossier: {
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
        },
        automated_analysis: {
          suitabilityScore: 92,
          verdict: 'Recomendada com Adaptação'
        },
        guardian_notes: 'Família com criança pequena (6 anos). Checar adaptação da Pipoca.'
      })
      .select();

    if (app2Err) {
      console.error('Erro ao inserir App 2:', app2Err);
    } else if (app2Data && app2Data[0]) {
      const app2Id = app2Data[0].id;
      console.log('App 2 criada com ID:', app2Id);

      // Inserir mensagens da App 2
      await supabase.from('application_messages').insert([
        {
          application_id: app2Id,
          sender_id: 'adopter-lucas-2',
          sender_name: 'Lucas Mendes',
          sender_role: 'candidate',
          message: 'Boa tarde! Nossa filha de 6 anos sonha com uma irmãzinha de 4 patas para a nossa cachorrinha Belinha. A Pipoca se dá bem com crianças?'
        }
      ]);
      console.log('Mensagens da App 2 inseridas.');
    }
  }

  console.log('--- Seed Concluído com Sucesso! ---');
}

seed();
