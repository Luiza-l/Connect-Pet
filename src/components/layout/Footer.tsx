import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShieldAlert, CheckCircle, Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full overflow-hidden bg-sky-100 text-foreground transition-colors duration-300 dark:bg-sky-950/55">
      
      {/* Onda Superior Suave em Azul-Claro conectando com precisão absoluta ao fundo da página */}
      <div className="w-full overflow-hidden leading-none -mt-px">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 text-background fill-current block transition-colors duration-300"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L1440,0 L1440,25 C1100,55 860,10 520,40 C240,65 80,20 0,35 Z" />
        </svg>
      </div>

      <div className="page-shell space-y-8 pb-8 pt-4 sm:pb-10">
        
        {/* Barra Superior do Rodapé (Logo e Links Estilo Canva) */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-sky-300/60 pb-6 dark:border-sky-800/70 md:flex-row">
          
          {/* Logo ConnectPet com Patinha */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl shadow-sm transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
              <Image src="/images/logo-connectpet-redondo.png" alt="" fill sizes="56px" className="object-contain" />
            </div>
            <span className="font-serif text-2xl font-extrabold tracking-tight text-foreground">
              ConnectPet
            </span>
          </Link>

          {/* Links Rápidos Estilo Referência Visual */}
          <nav aria-label="Links do rodapé" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-bold text-foreground sm:gap-x-7">
            <Link href="/" className="inline-flex min-h-[44px] items-center transition-colors hover:text-primary">
              Início
            </Link>
            <Link href="/pets" className="inline-flex min-h-[44px] items-center transition-colors hover:text-primary">
              Catálogo
            </Link>
            <Link href="/sobre-nos" className="inline-flex min-h-[44px] items-center transition-colors hover:text-primary">
              Sobre nós
            </Link>
            <Link href="/pets?favoritos=true" className="inline-flex min-h-[44px] items-center transition-colors hover:text-primary">
              Favoritos
            </Link>
            <Link href="/match" className="inline-flex min-h-[44px] items-center transition-colors hover:text-primary">
              SmartMatch
            </Link>
            <Link href="/perfil" className="inline-flex min-h-[44px] items-center transition-colors hover:text-primary">
              Perfil
            </Link>
          </nav>

        </div>

        {/* Conscientização Legal e Ética (Lei 9.605/98) */}
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-sky-200/80 bg-card/90 p-5 text-card-foreground shadow-sm backdrop-blur-sm dark:border-sky-800/70 sm:p-6 md:flex-row md:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Scale className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="flex items-start gap-2 text-sm font-bold text-foreground sm:items-center sm:text-base">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:mt-0" />
              Abandono e Maus-Tratos é Crime (Lei Federal nº 9.605/98 - Art. 32)
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Pena de reclusão de 2 a 5 anos, multa e proibição da guarda. Adotar é um compromisso vitalício de amor, segurança e dedicação integral.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <CheckCircle className="w-3.5 h-3.5 text-sky-600" /> Posse Responsável
            </span>
          </div>
        </div>

        {/* Linha Inferior com Copyright */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-sky-300/50 pt-5 text-center text-xs font-medium text-muted-foreground dark:border-sky-800/70 sm:flex-row sm:text-left">
          <p>© 2026 ConnectPet • Adoção Consciente e Responsável. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <span>Privacidade &amp; LGPD</span>
            <span>Termos de Uso</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Salve Vidas
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
