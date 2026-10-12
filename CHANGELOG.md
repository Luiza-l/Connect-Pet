# Changelog

## [v0.9.9] - 2026-10-12
### Commit
`style: aumentar logo redondo na navbar e no rodapé`

### Mudanças
- Navbar: logo redondo passa de 40/48px para 44/56px (mobile/`sm`+), com recorte circular.
- Rodapé: logo redondo passa de 40px para 48/56px, com recorte circular.

---

## [v0.9.8] - 2026-10-12
### Commit
`feat: aplicar novos logos do ConnectPet`

### Mudanças
- Logo quadrado aplicado na navbar, no rodapé e nos favicons (`icon.png`, `apple-icon.png` e `favicon.ico` regenerados).
- Logo redondo aplicado no topo das páginas de login e cadastro.
- Remove `public/icon.svg` e as referências a ele nos metadados.

---

## [v0.9.7] - 2026-10-12
### Commit
`feat: aplicar indicador deslizante nos seletores segmentados`

### Mudanças
- Cria o componente reutilizável `SeletorDeslizante`, com pílula animada, `ResizeObserver` e suporte a `prefers-reduced-motion`.
- Aplica o componente no alternador "Quero Adotar / Sou ONG / Doador" do login e do cadastro.
- Aplica o componente nas abas do painel de gestão e no alternador cartões/lista de animais.

---

## [v0.9.6] - 2026-10-12
### Commit
`refactor: equilibrar proporções da navbar e da página inicial`

### Mudanças
- Navbar: aumenta espaçamento entre itens do menu desktop, ícones, logo e padding da pílula, preservando o layout móvel.
- Home: amplia textos secundários, ícones, botões e títulos dos cards, números dos pilares e metadados dos cards de pets, mantendo a identidade visual.
- Alvos de toque dos botões dos cards com altura mínima de 44px.

---

## [v0.9.5] - 2026-10-12
### Commit
`feat: adicionar indicador deslizante na navbar`

### Mudanças
- Adiciona pílula animada que desliza até o link ativo na navegação desktop, com suporte a `prefers-reduced-motion` e temas claro/escuro.

---

## [v0.9.4] - 2026-10-12
### Commit
`fix: remover rolagem vertical duplicada`

### Mudanças
- Remove a altura mínima desnecessária do invólucro global de animações, permitindo que o documento mantenha uma única área de rolagem.
- Troca o recorte horizontal por `overflow-x: clip`, evitando que o navegador crie implicitamente contêineres de rolagem vertical no corpo e na página inicial.

---

## [v0.9.3] - 2026-10-12
### Commit
`feat: adicionar animações sutis de entrada e navegação`

### Mudanças
- Revela cards e seções progressivamente durante a rolagem, combinando opacidade e deslocamento leve com escalonamento discreto entre itens.
- Adiciona uma transição breve de entrada ao novo conteúdo em cada navegação, sem aguardar animações de saída ou atrasar a troca de página.
- Usa APIs nativas do navegador, anima apenas propriedades de composição e respeita a preferência de movimento reduzido para preservar desempenho e acessibilidade.

---

## [v0.9.2] - 2026-10-12
### Commit
`style: suavizar superfícies do modo claro`

### Mudanças
- Substitui o branco puro do fundo global por um off-white frio e levemente azulado, alinhado à identidade visual do ConnectPet.
- Diferencia páginas, cards, popovers, áreas secundárias e bordas com uma hierarquia tonal mais confortável, preservando contraste e legibilidade.
- Harmoniza superfícies translúcidas, destaques da página inicial e controles sobre imagens com os tokens semânticos do tema claro, sem alterar a paleta do modo escuro.

---

## [v0.9.1] - 2026-10-12
### Commit
`fix: simplificar triagem e preservar respostas do dossiê`

### Mudanças
- Reorganiza cada candidatura em um resumo essencial e grupos recolhíveis de perguntas e respostas, mantendo os textos completos e claramente identificados.
- Move a análise automática e as anotações internas para áreas sob demanda, reduzindo a poluição visual sem remover recursos de triagem, contato ou conversa.
- Persiste todas as respostas do formulário também em um snapshot versionado do dossiê e usa esse registro como fallback na leitura das candidaturas.
- Adiciona filtros recolhíveis no celular, alvos de toque acessíveis e tratamento de quebra de texto para telas a partir de 320 px.

---

## [v0.9.0] - 2026-10-12
### Commit
`feat: aprimorar experiência visual e responsiva da plataforma`

### Mudanças
- Consolida a hierarquia visual, os espaçamentos e as superfícies da home, do catálogo, da autenticação e dos formulários, preservando a identidade azul do ConnectPet.
- Substitui o painel móvel de filtros por um drawer acessível, adiciona contagem de filtros ativos e melhora a navegação móvel e os menus de conta e tema.
- Uniformiza cards de animais, estados de foco, áreas de toque, tipografia de formulários e comportamento em telas a partir de 320 px.
- Sincroniza o rodapé e as principais superfícies de marca nos temas claro e escuro, com contraste e legibilidade aprimorados.
- Adiciona atalho para o conteúdo principal, suporte a movimento reduzido, semântica de diálogo e melhorias de teclado e acessibilidade em fluxos essenciais.

---

## [v0.8.0] - 2026-10-11
### Commit
`feat: exibir apresentação pública da ONG no card de responsável do pet`

### Mudanças
- Exibe no card "ONG responsável" da página do animal a história/missão, logo, selo de verificação, redes sociais, tempo na plataforma e quantidade de animais disponíveis.
- Adiciona a função `obter_perfil_publico_guardiao` ao `schema.sql`, expondo apenas dados institucionais (sem documento, e-mail ou telefone).
- Corrige o carregamento das redes sociais do responsável, que eram salvas mas não lidas de volta no perfil.
- Informa no perfil do responsável onde a apresentação é exibida.

---

## [v0.7.0] - 2026-10-11
### Commit
`feat: alinhar Smart Match aos dados dos anúncios`

### Mudanças
- Reduz o Smart Match a preferências e condições comparáveis com dados objetivos dos pets: espécie, porte, idade, energia, convivência e necessidades especiais.
- Move a avaliação de moradia, segurança, rotina, alergias, ausências, experiência e preparo financeiro para o dossiê de pré-adoção.
- Adiciona ao cadastro e aos anúncios campos simples de energia e convivência observada com crianças, cães e gatos, incluindo a opção segura “Ainda não avaliado”.
- Amplia o dossiê com a organização dos cuidados diários e detalhes dos animais residentes, preservando essas respostas para a análise do responsável.
- Atualiza o motor determinístico, a Edge Function, o schema do Supabase e os testes automatizados para o novo contrato de compatibilidade.

---

## [v0.6.2] - 2026-10-11
### Commit
`fix: proteger e validar a integração de inteligência artificial`

### Mudanças
- Restringe a persistência de análises de IA à Edge Function, valida contratos em tempo de execução e impede que clientes forjem o selo de análise contextual.
- Consulta os pets canônicos no Supabase, rejeita questionários incompletos, reduz dados enviados ao provedor e adiciona timeout às chamadas do GroqCloud.
- Separa os textos contextuais da IA dos fatores determinísticos, corrige estados vazios e de erro e exige ação explícita antes de enviar respostas ao provedor.
- Adiciona limite diário atômico por usuário, calibra o índice heurístico para reduzir saturação e inclui testes automatizados do motor de avaliação.

---

## [v0.6.1] - 2026-10-11
### Commit
`fix: corrigir tipos nas políticas do Supabase Storage`

### Mudanças
- Converte o UUID do usuário autenticado para texto nas políticas de fotos de pets e avatares, compatibilizando a comparação com `storage.objects.owner_id`.
- Impede o erro PostgreSQL `42883` ao reaplicar o schema no Supabase sem alterar ou remover dados existentes.

---

## [v0.6.0] - 2026-10-11
### Commit
`feat: integrar ia explicável ao smart match e à triagem`

### Mudanças
- Integra o GroqCloud por uma Edge Function autenticada do Supabase, com chave protegida, dados pessoais minimizados e saída JSON validada.
- Mantém as pontuações de compatibilidade determinísticas e auditáveis, usando a IA apenas para contextualizar justificativas, cuidados e perguntas para entrevista.
- Amplia o Smart Match com perguntas sobre atividade, experiência, orçamento, viagens, alergias e adaptações da moradia, além de fallback local quando a IA estiver indisponível.
- Permite que ONGs e doadores gerem e atualizem análises contextualizadas nas candidaturas, visualizem os fatores da nota e preservem explicitamente a decisão humana.
- Restringe a persistência da análise automática ao responsável autenticado e documenta a configuração segura, publicação e limitações do plano gratuito.

---

## [v0.5.0] - 2026-10-11
### Commit
`feat: modernizar painel de gestão de adoções`

### Mudanças
- Reorganiza o dashboard de ONGs e doadores com visão geral orientada a tarefas, navegação persistida na URL e indicadores reais acionáveis.
- Consolida a gestão de animais em uma única experiência com busca, filtros, ordenação, cartões, tabela, completude do anúncio e contagem de candidaturas.
- Aprimora a triagem com filtros, ordenação por atividade, dossiê em painel móvel, contatos rápidos e menor destaque decisório para a análise automática.
- Adiciona confirmação e regras seguras para transições de candidatura, incluindo a sincronização correta do pet ao concluir ou reabrir uma adoção.
- Filtra candidaturas recebidas pelo responsável autenticado e adiciona datas de atualização e índice composto alinhado à consulta do painel.
- Atualiza os rótulos de navegação para atender igualmente ONGs e doadores individuais, preservando responsividade, acessibilidade e temas claro/escuro.

---

## [v0.4.2] - 2026-10-11
### Commit
`fix: sincronizar adoções concluídas com métricas e pets`

### Mudanças
- Atualiza o pet para adotado quando a ONG ou o doador conclui uma candidatura, refletindo a mudança imediatamente no painel e de forma persistente no banco.
- Corrige os indicadores para contar candidaturas realmente abertas e reconhecer adoções concluídas em dados legados sem duplicar o mesmo pet.

---

## [v0.4.1] - 2026-10-11
### Commit
`fix: impedir falhas com imagens externas não autorizadas`

### Mudanças
- Normaliza fotos de pets, candidaturas e avatares antes da renderização pelo `next/image`.
- Substitui URLs legadas de origens não configuradas pelo placeholder local, preservando apenas caminhos locais, Unsplash e o Storage do Supabase.

---

## [v0.4.0] - 2026-10-11
### Commit
`feat: concluir gestão segura de pets e persistência real no Supabase`

### Mudanças
- Consolida o cadastro, a edição, a atualização de status e a exclusão dos pets publicados pelo próprio perfil de ONG ou doador, com confirmação de persistência, tratamento de carregamento e limpeza das fotos no Storage.
- Remove dados mockados, respostas fictícias de candidaturas, métricas inventadas e persistências de negócio no navegador, mantendo apenas dados reais carregados do Supabase.
- Reforça autenticação, cadastro de ONG ou doador individual, perfis, favoritos, candidaturas, mensagens, avatares, RLS, privilégios e triggers no schema idempotente.
- Corrige estados de erro e carregamento, rotas legadas, textos imprecisos e responsividade mobile-first com áreas de toque acessíveis.
- Remove dependências, utilitários, dados e imagens padrão sem uso e restringe as origens remotas aceitas pelo componente de imagens.
- Atualiza Next.js e eslint-config-next para 16.4.0, aplica correções transitivas seguras e deixa a auditoria de dependências de produção sem vulnerabilidades conhecidas.

---

## [v0.3.0] - 2026-10-10
### Commit
`feat: permitir edição segura dos pets publicados`

### Mudanças
- Adiciona acesso à edição em cada cartão de pet do painel da ONG ou doador.
- Permite atualizar dados, fotos, condições de saúde e status da adoção em um formulário responsivo.
- Restringe a edição ao perfil proprietário e só confirma o salvamento após a resposta do Supabase.

---

## [v0.2.4] - 2026-10-10
### Commit
`fix: sincronizar autenticação real no envio de fotos`

### Mudanças
- Remove acessos mockados que exibiam uma conta de doador sem criar sessão no Supabase Auth.
- Impede que perfis salvos localmente sejam tratados como uma sessão autenticada.
- Melhora o diagnóstico de sessão no envio de fotos e adiciona a política de leitura dos próprios objetos no Storage.

---

## [v0.2.3] - 2026-10-10
### Commit
`fix: armazenar sessão do Supabase fora dos headers HTTP`

### Mudanças
- Substitui o cliente SSR no navegador pelo cliente Supabase padrão com sessão persistida no armazenamento local.
- Remove automaticamente cookies de autenticação legados quando a aplicação consegue carregar.
- Remove o proxy de sessão, pois o projeto não consome autenticação em componentes ou ações do servidor.

---
