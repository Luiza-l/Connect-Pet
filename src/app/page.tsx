"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PetGrid } from "@/components/pets/PetGrid";
import { mockPets } from "@/data/pets";
import { Heart, Search, ShieldCheck, Sparkles, Check, BookOpen, Home as HomeIcon, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const featuredPets = mockPets.slice(0, 4);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          <motion.div 
            className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Conexão verdadeira &bull; Adoção consciente
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-[4rem] font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
              Encontre um novo <br className="hidden md:block" />
              melhor amigo.
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Mais do que adotar um animal, é dar uma nova chance a uma história de amor. Conheça cães e gatos resgatados por ONGs e protetores que sonham com um lar seguro, carinhoso e responsável.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 bg-white/50 dark:bg-black/20">
                <ShieldCheck className="w-4 h-4 text-primary" /> Processo seguro e assistido
              </div>
              <div className="flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 bg-white/50 dark:bg-black/20">
                <Check className="w-4 h-4 text-primary" /> Saúde & Vacinas verificadas
              </div>
              <div className="flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 bg-white/50 dark:bg-black/20">
                <Heart className="w-4 h-4 text-primary" /> Acompanhamento pós-adoção
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/pets">
                  <Sparkles className="w-5 h-5 mr-2" /> Encontrar um pet
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base rounded-full border-2 bg-transparent hover:bg-secondary/50">
                <Link href="#como-funciona">Como funciona a adoção</Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full max-w-[500px] lg:max-w-none relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop"
                alt="Pessoa feliz abraçando dois cachorros"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-8 -left-8 md:-left-12 p-3 bg-white dark:bg-card rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both border border-border/50">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-bold text-sm leading-tight text-foreground">+450 Pets Acolhidos</span>
                <span className="text-[11px] text-muted-foreground">por famílias conscientes</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-4 md:-right-8 p-3 bg-white dark:bg-card rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both border border-border/50">
              <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-bold text-sm leading-tight text-foreground">Guarda Responsável</span>
                <span className="text-[11px] text-muted-foreground">Triagem que protege vidas</span>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-16 p-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1 block">Histórias Reais</span>
              <p className="text-white text-sm font-medium italic leading-snug">
                "Adotar o Bento transformou a energia e a alegria da casa para sempre."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16 flex flex-col items-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="inline-flex px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-6">
              Nosso Compromisso
            </div>
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-bold tracking-tight mb-6 text-foreground">
              Adoção que conecta propósitos e corações
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Não somos um catálogo comercial. Somos uma ponte humanizada para unir pessoas preparadas a animais que esperam por um recomeço seguro.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { icon: Search, badge: "DIVERSIDADE & AMOR", title: "Encontre pets disponíveis", desc: "Cães e gatos de todos os portes, idades e personalidades, acolhidos por ONGs sérias e protetores dedicados." },
              { icon: BookOpen, badge: "TRANSPARÊNCIA REAL", title: "Conheça cada história", desc: "Cada animal possui um passado, suas manias e traços únicos de comportamento documentados com sensibilidade e verdade." },
              { icon: HomeIcon, badge: "GUARDA CONSCIENTE", title: "Compatibilidade com seu estilo", desc: "Ajudamos você a entender se a rotina, o espaço da sua moradia e seu tempo livre combinam com as necessidades do pet." },
              { icon: HeartHandshake, badge: "IMPACTO SOCIAL", title: "Faça parte da mudança", desc: "Adotar é combater o abandono e abrir espaço para que mais vidas possam ser resgatadas e acolhidas com dignidade." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="group flex flex-col items-start text-left p-8 bg-secondary/20 rounded-[2rem] border border-secondary/30 transition-all duration-500 hover:bg-secondary/40 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                <div className="w-12 h-12 bg-card text-foreground rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-border/50 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{feature.badge}</span>
                <h3 className="font-serif text-xl font-bold mb-4 text-foreground leading-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <div className="inline-flex px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
                Adoção com amor
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-3">Eles estão esperando por você</h2>
              <p className="text-sm text-muted-foreground">Cada focinho traz uma história única de superação e muito carinho para compartilhar.</p>
            </div>
          </motion.div>
          
          <PetGrid pets={featuredPets} />
          
          <div className="mt-16 flex justify-center">
            <Link href="/pets" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5" /> Ver todos os pets disponíveis
            </Link>
          </div>
        </div>
      </section>

      {/* Processo de Adoção Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16 flex flex-col items-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="inline-flex px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-6">
              Passo a Passo Transparente
            </div>
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-bold tracking-tight mb-6 text-foreground max-w-2xl leading-tight">
              Como funciona o processo de adoção responsável
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Priorizamos o bem-estar dos animais e a tranquilidade dos adotantes com uma jornada clara e acolhedora.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { num: "01", icon: Search, title: "1. Encontre o pet", desc: "Navegue pelo catálogo humanizado, leia as histórias e descubra temperamentos que combinam com seu estilo de vida." },
              { num: "02", icon: BookOpen, title: "2. Formulário de Pré-Adoção", desc: "Informe sobre sua estrutura habitacional (telas/muros), rotina, concordância familiar e ciência dos cuidados veterinários." },
              { num: "03", icon: ShieldCheck, title: "3. Avaliação da ONG ou Doador", desc: "O responsável pelo pet analisa as informações com carinho e responsabilidade para assegurar uma guarda segura." },
              { num: "04", icon: HeartHandshake, title: "4. Devolutiva e Encontro", desc: "Converse pelo chat interno ou WhatsApp, agende a visita para se conhecerem e formalize o termo de adoção." }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="flex flex-col items-start text-left p-8 bg-card rounded-[2rem] border border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
                <span className="absolute top-6 right-6 font-serif text-4xl font-bold text-muted/30 group-hover:text-primary/10 transition-colors">{step.num}</span>
                <div className="w-10 h-10 bg-secondary/30 text-foreground rounded-xl flex items-center justify-center mb-8">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-3 text-foreground leading-tight pr-4">{step.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-secondary/40 border border-secondary p-6 rounded-2xl flex items-start gap-4 max-w-4xl mx-auto"
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-xl shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Por que realizamos triagem prévia?</h4>
              <p className="text-sm text-muted-foreground">
                Garantir que janelas possuam telas para gatos, que casas tenham muros para cães e que a família esteja alinhada previne novos abandonos e acidentes graves.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
