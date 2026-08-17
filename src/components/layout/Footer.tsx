import Link from "next/link";
import { Heart, PawPrint, CheckCircle2, MessageCircleQuestion } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#112315] text-white pt-16 pb-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Logo & About */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20">
                <PawPrint className="h-5 w-5 fill-current" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">AcolherPet</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-md mb-6">
              Plataforma dedicada à promoção da guarda consciente e adoção responsável de cães e gatos resgatados. Conectando histórias, corações e lares seguros.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#4CAF50] font-medium bg-[#4CAF50]/10 px-3 py-1.5 rounded-full border border-[#4CAF50]/20">
              <Heart className="w-4 h-4 fill-current" /> Adotar é um ato de amor e compromisso para toda a vida.
            </div>
          </div>
          
          {/* Links Nav */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-lg mb-6 text-white">Navegação</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/pets" className="hover:text-white transition-colors">Pets para Adoção</Link></li>
              <li><Link href="/match" className="hover:text-white transition-colors">Match de Estilo de Vida</Link></li>
            </ul>
          </div>
          
          {/* Links ONGs */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-bold text-lg mb-6 text-white">ONGs & Protetores</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Painel do Doador</Link></li>
              <li><Link href="/cadastro-ong" className="hover:text-white transition-colors">Cadastrar ONG / Abrigo</Link></li>
              <li><span className="text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded text-xs border border-[#4CAF50]/20 font-medium">Triagem com IA Integrada</span></li>
            </ul>
          </div>
          
          {/* Guarda Responsável */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-bold text-lg mb-6 text-white">Guarda Responsável</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/70">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4CAF50]" /> Vacinação V8/V10 & Raiva</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4CAF50]" /> Castração Obrigatória</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4CAF50]" /> Janelas e Sacadas Teladas</li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 text-xs text-white/40 gap-4">
          <p>&copy; {new Date().getFullYear()} AcolherPet. Todos os direitos reservados. Promovendo o bem-estar animal.</p>
          <p>Desenvolvido com carinho para o TCC de Adoção Responsável 🐕</p>
        </div>
      </div>
      
      {/* Floating Button */}
      <button className="fixed bottom-6 right-6 z-50 bg-[#2E4F35] text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-black/20 border border-white/10 hover:bg-[#1E3723] hover:scale-105 transition-all font-semibold text-sm">
        <MessageCircleQuestion className="w-5 h-5" /> Tirar dúvidas sobre Adoção
      </button>
    </footer>
  );
}
