# 🐾 ConnectPet - Plataforma de Adoção de Pets

Plataforma web desenvolvida para conectar pessoas interessadas em adotar animais a tutores, protetores e ONGs que disponibilizam pets para adoção.

O projeto busca tornar o processo de adoção mais **humanizado, seguro e responsável**, permitindo que os usuários conheçam a história, características e necessidades dos animais antes de demonstrar interesse.

---

## Tecnologias

- [Next.js](https://nextjs.org/) — Framework principal
- [React](https://react.dev/) — Construção da interface
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — Estilização
- [shadcn/ui](https://ui.shadcn.com/) — Componentes de interface
- [Motion](https://motion.dev/) — Animações e microinterações
- [Supabase](https://supabase.com/) — Banco de dados e autenticação

## Mapa de ONGs

A rota pública `/mapa-ongs` usa Leaflet, React Leaflet e OpenStreetMap. O cadastro e o perfil de contas ONG permitem escolher e confirmar um ponto aproximado e autorizar sua exibição. Contas antigas continuam privadas até optar pelo mapa. Endereço completo e CEP são opcionais e acessíveis somente ao titular; não são enviados à geocodificação nem retornados pela consulta pública. O catálogo aceita `/pets?ong=UUID`, combinando o filtro da ONG com os demais critérios e mostrando apenas pets com status `available`.

Antes de disponibilizar a funcionalidade, aplique **a seção 14 de [supabase/schema.sql](supabase/schema.sql)** no SQL Editor do Supabase. Ela é idempotente e inclui os novos campos de `profiles`, restrições, índices, trigger de cadastro e a RPC `listar_ongs_no_mapa`. Reutiliza as políticas de proprietário já existentes em `profiles`, sem liberar leitura pública da tabela. A função interna em `privado` retorna uma projeção limitada; mantenha esse esquema fora dos esquemas expostos pela Data API. A RPC pública retorna somente ONGs com autorização ativa e conta os pets pelo vínculo real `pets.guardian_id = profiles.id::text`. Revogar a autorização retira a ONG das consultas imediatamente; abas abertas revalidam os dados ao retornar à página e a cada minuto.

Todas as consultas e gravações continuam acontecendo diretamente no cliente Supabase. Não há API Routes, Server Actions ou chaves administrativas no navegador. Os testes de RLS e migração usam um Postgres temporário via PGlite, sem gravar no projeto real: `npm test`.

A geocodificação usa o [Photon](https://github.com/komoot/photon#demo-server), somente após clicar em “Localizar centro do município”, com cache por município durante a sessão. Apenas município, estado e país são enviados. O serviço público aceita uso moderado, sem garantia de disponibilidade; para tráfego maior, configure uma instância compatível em `NEXT_PUBLIC_GEOCODIFICADOR_URL`. Não utiliza o Nominatim público. A ONG também pode escolher uma região diretamente no mapa e confirmar o ponto, mesmo quando a geocodificação falha.

Os tiles seguem a [política do OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/): atribuição visível, HTTPS, cache HTTP padrão do navegador e ausência de download antecipado ou uso offline. `NEXT_PUBLIC_MAPA_TILES_URL` permite trocar por um servidor de tiles compatível com a atribuição OpenStreetMap; provedores que exigirem créditos adicionais precisam ter sua atribuição incluída no componente. O fundo cartográfico depende da disponibilidade do serviço. A lista e os filtros continuam acessíveis em caso de falha. A localização do visitante é solicitada apenas pelo botão “ONGs perto de mim” e permanece na memória da página, sem persistência no banco ou no armazenamento local.
