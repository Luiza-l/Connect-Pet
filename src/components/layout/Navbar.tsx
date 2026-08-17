import Link from "next/link";
import { PawPrint, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-[88px] items-center justify-between px-4 sm:px-8">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
            <PawPrint className="h-6 w-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-2xl leading-none text-foreground tracking-tight">AcolherPet</span>
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase mt-1">Adoção Responsável</span>
          </div>
        </Link>
        
        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className="px-5 py-2.5 rounded-full bg-secondary/50 text-foreground font-semibold text-sm transition-colors hover:bg-secondary">
            Início
          </Link>
          <Link href="/pets" className="px-5 py-2.5 rounded-full text-muted-foreground font-medium text-sm transition-colors hover:bg-secondary/50 hover:text-foreground flex items-center gap-2">
            <PawPrint className="w-4 h-4" /> Pets para Adoção
          </Link>
          <Link href="/#como-funciona" className="px-5 py-2.5 rounded-full text-muted-foreground font-medium text-sm transition-colors hover:bg-secondary/50 hover:text-foreground">
            Como Funciona
          </Link>
          <Link href="/match" className="px-5 py-2.5 rounded-full text-muted-foreground font-medium text-sm transition-colors hover:bg-secondary/50 hover:text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Match com IA
          </Link>
        </nav>
        
        {/* Right Side (User Profile Mock) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 p-1.5 pr-4 rounded-full border border-border/60 bg-white/50 dark:bg-black/20 shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
            <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden border border-border">
              <img src="https://i.pravatar.cc/150?u=camila" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-tight">Camila Rodrigues Alves</span>
              <span className="text-[10px] text-muted-foreground">Candidata a Tutor</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold ml-2 shadow-sm">
              1
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden text-primary">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        
      </div>
    </header>
  );
}
