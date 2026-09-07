import React from "react";
import Link from "next/link";
import { PawPrint, Heart, ShieldAlert, CheckCircle, Scale, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/60 pt-16 pb-12 text-muted-foreground transition-colors">
      <div className="container mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Conscientização Legal Banner (Lei 9.605/98) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-amber-500/10 border border-amber-500/20 text-foreground flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base text-foreground flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Abandono e Maus-Tratos é Crime (Lei Federal nº 9.605/98 - Art. 32)
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Pena de reclusão de 2 a 5 anos, multa e proibição da guarda quando se tratar de cão ou gato. Adotar é um compromisso vitalício de amor, saúde, segurança e dedicação integral.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <CheckCircle className="w-3.5 h-3.5" /> Posse Responsável
            </span>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-sm">
                <PawPrint className="h-5 w-5 fill-current" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-foreground">
                ConnectPet
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Plataforma independente de acolhimento e conexão responsável. Nossos animais são resgatados, avaliados clinicamente e encaminhados com triagem ética e transparente.
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Feito com carinho para salvar vidas
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Navegação
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/pets" className="hover:text-primary transition-colors">
                  Animais Disponíveis
                </Link>
              </li>
              <li>
                <Link href="/match" className="hover:text-primary transition-colors">
                  Calculadora Smart Match
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-primary transition-colors">
                  Como Funciona a Triagem
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Diretrizes & Ética
            </h5>
            <ul className="space-y-2 text-xs">
              <li>Regra dos 21 Anos Completos</li>
              <li>Telas em Janelas / Muros Altos</li>
              <li>Sem Venda ou Comércio de Vidas</li>
              <li>Acompanhamento Pós-Adoção</li>
              <li>Conformidade com a LGPD</li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Central de Acolhimento
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>São Paulo, SP e Regiões Metropolitanas</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contato@connectpet.org.br</span>
              </li>
              <li className="text-[11px] text-muted-foreground pt-2">
                Atendimento de segunda a sábado das 09h às 18h para orientações e suporte às ONGs parceiras.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© 2026 ConnectPet (Acolher Pet). Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Privacidade & LGPD</span>
            <span>Termos de Uso</span>
            <span>Código de Ética Animal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
