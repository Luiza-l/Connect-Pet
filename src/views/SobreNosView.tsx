import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Heart,
  HeartHandshake,
  MessageCircleHeart,
  PawPrint,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PawWatermark } from "@/components/ui/PawWatermark";

const participantes = [
  {
    titulo: "Animais",
    descricao:
      "Ganham visibilidade com perfis completos, histórias reais e informações que ajudam a encontrar o lar certo.",
    icone: PawPrint,
    detalhe: "Cada perfil é uma nova possibilidade.",
  },
  {
    titulo: "Adotantes",
    descricao:
      "Encontram informações claras, afinidade de rotina e um caminho organizado para tomar uma decisão consciente.",
    icone: UsersRound,
    detalhe: "Escolhas guiadas por compatibilidade e cuidado.",
  },
  {
    titulo: "ONGs e protetores",
    descricao:
      "Centralizam a divulgação, a triagem e o acompanhamento das candidaturas em uma jornada mais segura.",
    icone: Building2,
    detalhe: "Mais organização para quem transforma vidas.",
  },
];

const recursos = [
  {
    titulo: "Smart Match",
    resumo: "Compatibilidade que vai além da aparência",
    descricao:
      "Um questionário considera rotina, moradia, experiência e preferências para sugerir perfis mais alinhados ao momento de cada adotante.",
    icone: Sparkles,
  },
  {
    titulo: "Candidaturas acompanhadas",
    resumo: "Cada etapa visível, do interesse à decisão",
    descricao:
      "Adotantes acompanham seus pedidos, enquanto responsáveis avaliam informações e mantêm a comunicação centralizada.",
    icone: FileCheck2,
  },
  {
    titulo: "Perfis que contam histórias",
    resumo: "Informação para criar conexões verdadeiras",
    descricao:
      "Fotos, personalidade, cuidados, porte e contexto ajudam as famílias a conhecer cada animal antes do primeiro encontro.",
    icone: HeartHandshake,
  },
  {
    titulo: "Gestão para quem protege",
    resumo: "Organização simples para uma missão complexa",
    descricao:
      "ONGs e protetores podem manter cadastros atualizados e conduzir a triagem com mais clareza, sem perder o olhar humano.",
    icone: ClipboardCheck,
  },
];

export function SobreNosView() {
  return (
    <div className="overflow-x-clip bg-background text-foreground">
      <section className="relative isolate overflow-hidden bg-sky-100/80 pb-16 pt-10 dark:bg-sky-950/55 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--color-primary)_0,transparent_28%)] opacity-15" />
        <PawWatermark
          rotate={-18}
          className="absolute left-[4%] top-10 h-12 w-12 text-primary/15 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
        />
        <PawWatermark
          rotate={22}
          className="absolute bottom-16 right-[5%] h-14 w-14 text-primary/15 sm:h-20 sm:w-20"
        />

        <div className="page-shell grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-14">
          <div className="relative z-10 text-center lg:text-left" data-revelar>
            <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur-sm">
              <Heart className="h-4 w-4 fill-rose-400/30 text-rose-500" />
              Sobre o ConnectPet
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:mx-0 lg:text-6xl xl:text-7xl">
              Conexões que mudam destinos.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              O ConnectPet aproxima animais que precisam de um lar, pessoas prontas para adotar e quem dedica a vida ao resgate. Tecnologia e cuidado caminhando juntos por adoções mais conscientes.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="min-h-[48px] rounded-full px-6">
                <Link href="/pets">
                  Conhecer os animais
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-[48px] rounded-full bg-card/70 px-6 backdrop-blur-sm">
                <Link href="#nossa-missao">Nossa missão</Link>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs font-semibold text-muted-foreground sm:text-sm lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> Processo transparente
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Adoção responsável
              </span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[5/4] w-full max-w-xl" data-revelar>
            <div className="absolute inset-x-[5%] inset-y-[3%] overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-sky-100 to-primary/20 shadow-2xl shadow-primary/10 dark:from-card dark:via-sky-950 dark:to-primary/20 sm:rounded-[3.5rem]">
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/15 to-transparent" />
              <Image
                src="/images/home/hero-dog-left-transparent.png"
                alt="Cachorro dálmata olhando com curiosidade"
                fill
                preload
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-contain object-bottom transition-transform duration-700 hover:scale-[1.02] motion-reduce:transition-none"
              />
            </div>

            <div className="absolute left-0 top-[9%] flex max-w-[10rem] items-center gap-2 rounded-2xl border border-border/70 bg-card/90 p-3 text-left shadow-lg backdrop-blur-md sm:max-w-xs sm:p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 sm:h-11 sm:w-11">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold leading-snug text-foreground sm:text-sm">Acolher com responsabilidade</span>
            </div>

            <div className="absolute bottom-[7%] right-0 max-w-[11rem] rounded-2xl border border-border/70 bg-card/90 p-3 shadow-lg backdrop-blur-md sm:max-w-xs sm:p-4">
              <p className="text-xs font-bold text-primary sm:text-sm">Uma ponte segura</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Entre uma história de resgate e um novo começo.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="nossa-missao" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-3xl text-center" data-revelar>
            <span className="section-kicker">Nosso porquê</span>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Toda adoção merece começar com informação, empatia e compromisso.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Nossa missão é tornar o encontro mais simples sem tornar a decisão superficial. Criamos ferramentas para que afinidade, preparo e bem-estar estejam no centro de cada escolha.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/10 transition-transform duration-300 hover:-translate-y-1 sm:p-8 lg:col-span-2">
              <PawWatermark rotate={18} className="absolute -bottom-5 -right-3 h-32 w-32 text-primary-foreground/10 sm:h-40 sm:w-40" />
              <div className="relative max-w-2xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
                  <HeartHandshake className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-serif text-2xl font-bold sm:text-3xl">Tecnologia a serviço do cuidado</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                  A plataforma organiza informações e aproxima pessoas, mas preserva o essencial: a análise humana, o diálogo e a responsabilidade compartilhada pelo futuro de cada animal.
                </p>
              </div>
            </article>

            <article className="group rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold">Responsabilidade antes da pressa</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Adotar é uma decisão para a vida toda. Incentivamos expectativas reais, conversa aberta e preparo para cada fase dessa convivência.
              </p>
            </article>

            <article className="group rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Search className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold">Clareza em cada perfil</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Quanto mais contexto, melhores as escolhas. Saúde, comportamento, rotina e necessidades aparecem de forma acessível.
              </p>
            </article>

            <article className="group rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-8 lg:col-span-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-primary">
                <MessageCircleHeart className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold">Uma rede que coopera</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Criamos um ponto de encontro para que adotantes, ONGs e protetores avancem na mesma direção: menos incerteza, mais diálogo e lares preparados para receber.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/35 py-16 sm:py-20 lg:py-24">
        <div className="page-shell">
          <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" data-revelar>
            <div>
              <span className="section-kicker">Uma conexão de cada vez</span>
              <h2 className="mt-3 text-balance font-serif text-3xl font-bold sm:text-4xl">Três lados, um mesmo propósito.</h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:justify-self-end">
              O ConnectPet transforma necessidades diferentes em uma jornada compartilhada, com recursos pensados para quem espera, quem procura e quem cuida.
            </p>
          </div>

          <div className="relative mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-16 hidden border-t border-dashed border-primary/35 md:block" />
            {participantes.map((participante) => {
              const Icone = participante.icone;
              return (
                <article
                  key={participante.titulo}
                  className="group relative rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:p-7"
                >
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 motion-reduce:transition-none">
                    <Icone className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{participante.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{participante.descricao}</p>
                  <p className="mt-5 border-t border-border/60 pt-4 text-xs font-bold uppercase tracking-wider text-primary">
                    {participante.detalhe}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-shell grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28" data-revelar>
            <span className="section-kicker">Feito para apoiar boas decisões</span>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
              Recursos que acompanham toda a jornada.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Da descoberta ao acompanhamento da candidatura, cada experiência foi pensada para reduzir ruídos e dar espaço ao que realmente importa.
            </p>

            <div className="relative mt-8 aspect-[3/1] w-full overflow-hidden rounded-3xl border border-primary/15 bg-sky-100/70 p-3 dark:bg-sky-950/40">
              <Image
                src="/images/home/pillars-illustration.png"
                alt="Ilustração de uma jornada entre busca, divulgação e adoção"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-contain p-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            {recursos.map((recurso, indice) => {
              const Icone = recurso.icone;
              return (
                <details
                  key={recurso.titulo}
                  open={indice === 0}
                  className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-colors open:border-primary/30 open:shadow-md"
                >
                  <summary className="flex min-h-[72px] cursor-pointer list-none items-center gap-4 p-4 transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                      <Icone className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-foreground sm:text-lg">{recurso.titulo}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground sm:text-sm">{recurso.resumo}</span>
                    </span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" />
                  </summary>
                  <div className="border-t border-border/60 px-4 py-5 pl-4 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pl-20">
                    {recurso.descricao}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sky-100/70 py-16 dark:bg-sky-950/45 sm:py-20 lg:py-24">
        <PawWatermark rotate={-24} className="absolute -left-6 bottom-8 h-28 w-28 text-primary/10 sm:h-36 sm:w-36" />
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto min-h-[22rem] w-full max-w-xl sm:min-h-[28rem]" data-revelar>
            <div className="absolute bottom-0 left-0 top-[7%] w-[62%] overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card shadow-xl">
              <Image
                src="/images/home/card-beagle.png"
                alt="Cachorro beagle apoiado e olhando para frente"
                fill
                sizes="(max-width: 1024px) 55vw, 26vw"
                className="object-contain object-bottom p-4"
              />
            </div>
            <div className="absolute bottom-[5%] right-0 top-0 w-[52%] overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-primary/15 to-card shadow-xl">
              <Image
                src="/images/home/card-cat-orange.png"
                alt="Gato laranja apoiado e olhando para frente"
                fill
                sizes="(max-width: 1024px) 48vw, 23vw"
                className="object-contain object-bottom p-4"
              />
            </div>
            <div className="absolute bottom-[2%] left-[36%] rounded-2xl border border-border/70 bg-card/95 px-4 py-3 text-center shadow-lg backdrop-blur-sm">
              <p className="text-sm font-bold text-foreground">Todo recomeço importa</p>
              <p className="mt-0.5 text-xs text-muted-foreground">e pode começar com um encontro.</p>
            </div>
          </div>

          <div data-revelar>
            <span className="section-kicker">Novas oportunidades</span>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
              Um lar não muda apenas o endereço de um animal. Muda toda a sua história.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              A adoção responsável interrompe ciclos de abandono, abre espaço para novos resgates e cria vínculos capazes de transformar duas vidas ao mesmo tempo.
            </p>
            <ul className="mt-7 space-y-4" aria-label="Compromissos para uma adoção responsável">
              {[
                "Respeitar o tempo de adaptação e a individualidade do animal.",
                "Considerar cuidados, rotina e custos por toda a vida.",
                "Escolher pela compatibilidade, não apenas pela aparência.",
              ].map((compromisso) => (
                <li key={compromisso} className="flex items-start gap-3 text-sm leading-relaxed text-foreground sm:text-base">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {compromisso}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary px-5 py-12 text-center text-primary-foreground shadow-2xl shadow-primary/15 sm:px-10 sm:py-16 lg:px-16">
            <PawWatermark rotate={-16} className="absolute -left-8 -top-8 h-32 w-32 text-primary-foreground/10" />
            <PawWatermark rotate={20} className="absolute -bottom-10 -right-8 h-36 w-36 text-primary-foreground/10" />
            <div className="relative mx-auto max-w-3xl" data-revelar>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                <PawPrint className="h-4 w-4" /> Seu próximo encontro pode estar aqui
              </span>
              <h2 className="mt-5 text-balance font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
                Pronto para transformar uma história?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Conheça os animais disponíveis, descubra afinidades e dê o primeiro passo com consciência e carinho.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="min-h-[48px] rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link href="/pets">
                    Explorar o catálogo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-[48px] rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:bg-transparent dark:hover:bg-primary-foreground/10">
                  <Link href="/match">
                    Fazer o Smart Match
                    <Sparkles className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
