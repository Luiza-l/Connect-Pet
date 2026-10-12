"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  PawPrint,
  Sparkles,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  LogOut,
  ChevronDown,
  Compass,
  FileCheck2,
  LayoutDashboard,
  User,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";

const assinarHidratacao = () => () => {};
const obterSnapshotCliente = () => true;
const obterSnapshotServidor = () => false;

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    logout,
    favorites,
    pets,
    theme,
    setTheme,
    showFavoritesOnly,
    setShowFavoritesOnly,
    requireAuth
  } = useApp();

  const isCatalog = pathname === "/pets";

  const handleFavoritesClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      requireAuth("favorites", { redirectTo: "/pets?favoritos=true" });
      return;
    }
    if (isCatalog) {
      e.preventDefault();
      setShowFavoritesOnly((prev) => !prev);
    } else {
      setShowFavoritesOnly(true);
    }
  };

  const favoritesCount = pets.length > 0
    ? favorites.filter((favId) => pets.some((p) => p.id === favId)).length
    : favorites.filter((favId) => !favId.startsWith('pet-')).length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const estaHidratado = useSyncExternalStore(
    assinarHidratacao,
    obterSnapshotCliente,
    obterSnapshotServidor
  );
  const temaVisivel = estaHidratado ? theme : "system";

  useEffect(() => {
    if (!mobileMenuOpen && !profileDropdownOpen && !themeDropdownOpen) return;

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
      setThemeDropdownOpen(false);
    };

    document.addEventListener("keydown", aoPressionarTecla);
    return () => document.removeEventListener("keydown", aoPressionarTecla);
  }, [mobileMenuOpen, profileDropdownOpen, themeDropdownOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [mobileMenuOpen]);

  const isAdopter = currentUser?.role === "adopter";
  const isGuardian = currentUser?.role === "guardian";

  const navLinks = [
    { label: "Início", href: "/", icon: null },
    { label: "Catálogo de Pets", href: "/pets", icon: PawPrint },
    { label: "Como Funciona", href: "/#como-funciona", icon: Compass },
    { label: "Smart Match", href: "/match", icon: Sparkles },
  ];

  const estaAtivo = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Indicador deslizante: posição e largura da pílula atrás do link ativo
  const refsLinks = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicador, setIndicador] = useState<{ esquerda: number; largura: number; visivel: boolean }>({
    esquerda: 0,
    largura: 0,
    visivel: false,
  });

  useLayoutEffect(() => {
    const atualizarIndicador = () => {
      const ativo = navLinks.find((link) => estaAtivo(link.href));
      const elemento = ativo ? refsLinks.current[ativo.href] : null;
      if (!elemento) {
        setIndicador((anterior) => (anterior.visivel ? { ...anterior, visivel: false } : anterior));
        return;
      }
      setIndicador({ esquerda: elemento.offsetLeft, largura: elemento.offsetWidth, visivel: true });
    };
    atualizarIndicador();
    window.addEventListener("resize", atualizarIndicador);
    return () => window.removeEventListener("resize", atualizarIndicador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 shadow-sm shadow-foreground/[0.02] backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between gap-2 px-4 sm:h-20 sm:gap-3 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" aria-label="ConnectPet — página inicial" className="group flex min-h-[44px] shrink-0 items-center gap-2 sm:gap-3 lg:justify-self-start">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Image
              src="/images/logo-connectpet-redondo.png"
              alt=""
              fill
              sizes="56px"
              priority
              className="object-contain"
            />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="font-serif font-bold text-xl sm:text-[1.65rem] leading-none text-foreground tracking-tight">
              ConnectPet
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav aria-label="Navegação principal" className="relative hidden items-center gap-2 rounded-full border border-border/60 bg-secondary/50 p-1.5 lg:flex lg:justify-self-center lg:gap-3 xl:gap-5">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-1.5 bottom-1.5 rounded-full bg-background shadow-sm ring-1 ring-border/50 transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none ${
              indicador.visivel ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: indicador.largura, transform: `translateX(${indicador.esquerda}px)` }}
          />
          {navLinks.map((link) => {
            const isActive = estaAtivo(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  refsLinks.current[link.href] = el;
                }}
                aria-current={isActive ? "page" : undefined}
                className={`relative z-10 flex min-h-[44px] items-center gap-2 rounded-full px-3.5 py-2 text-[.980rem] font-semibold transition-colors duration-300 xl:px-5 ${
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="h-4 w-4 text-primary" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Favorites, Theme & User Profile */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:justify-self-end">
          
          {/* Favorites Button */}
          <Link
            href="/pets?favoritos=true"
            onClick={handleFavoritesClick}
            className={`relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border transition-all ${
              isCatalog && showFavoritesOnly
                ? "bg-rose-500/15 border-rose-500/40 text-rose-500 shadow-sm"
                : "border-border/50 bg-card hover:bg-secondary/50 text-muted-foreground hover:text-rose-500"
            }`}
            title={isCatalog && showFavoritesOnly ? "Ver Todos os Pets" : "Ver Pets Favoritos"}
            aria-label={isCatalog && showFavoritesOnly ? "Exibir todos os pets" : `Exibir favoritos${favoritesCount ? `, ${favoritesCount} salvos` : ""}`}
          >
            <Heart className={`w-5 h-5 ${favoritesCount > 0 || (isCatalog && showFavoritesOnly) ? "text-rose-500 fill-rose-500/20" : ""}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-sm animate-in zoom-in-50">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Theme Selector Button */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-border/50 bg-card hover:bg-secondary/50 text-muted-foreground transition-colors"
              title="Mudar Tema"
              aria-label="Mudar Tema"
              aria-haspopup="menu"
              aria-expanded={themeDropdownOpen}
            >
              {temaVisivel === "light" && <Sun className="w-5 h-5 text-amber-500" />}
              {temaVisivel === "dark" && <Moon className="w-5 h-5 text-indigo-400" />}
              {temaVisivel === "system" && <Laptop className="w-5 h-5 text-muted-foreground" />}
            </button>

            {themeDropdownOpen && (
              <div role="menu" aria-label="Escolher tema" className="absolute right-0 mt-2 w-40 rounded-2xl bg-popover border border-border/60 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setTheme("light");
                    setThemeDropdownOpen(false);
                  }}
                  role="menuitemradio"
                  aria-checked={theme === "light"}
                  className={`flex min-h-[44px] w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    theme === "light" ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" /> Claro
                </button>
                <button
                  onClick={() => {
                    setTheme("dark");
                    setThemeDropdownOpen(false);
                  }}
                  role="menuitemradio"
                  aria-checked={theme === "dark"}
                  className={`flex min-h-[44px] w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    theme === "dark" ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" /> Escuro
                </button>
                <button
                  onClick={() => {
                    setTheme("system");
                    setThemeDropdownOpen(false);
                  }}
                  role="menuitemradio"
                  aria-checked={theme === "system"}
                  className={`flex min-h-[44px] w-full items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    theme === "system" ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <Laptop className="w-4 h-4 text-muted-foreground" /> Sistema
                </button>
              </div>
            )}
          </div>

          {/* User Account / Demo Profile Switcher */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setThemeDropdownOpen(false);
                }}
                aria-haspopup="menu"
                aria-expanded={profileDropdownOpen}
                aria-label={`Abrir menu de ${currentUser.name}`}
                className="flex items-center gap-2.5 p-1.5 pr-3 min-h-[44px] rounded-full border border-border/60 bg-card hover:border-primary/40 shadow-sm transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden relative border border-primary/25 bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-sky-700 dark:text-sky-300" />
                  )}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="max-w-32 truncate text-xs font-bold leading-tight text-foreground">
                    {currentUser.name}
                  </span>
                  <span className="text-xs font-medium text-primary leading-none">
                    {isAdopter ? "Adotante" : "ONG / Protetor"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div role="menu" aria-label="Menu da conta" className="absolute right-0 mt-2 w-64 rounded-2xl bg-popover border border-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2.5 border-b border-border/60 mb-2">
                    <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {isAdopter ? "Candidato a Tutor" : "ONG / Protetor"}
                    </span>
                  </div>

                  {/* Editar Perfil */}
                  <Link
                    href="/perfil"
                    role="menuitem"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex min-h-[44px] items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-secondary transition-colors"
                  >
                    <UserCog className="w-4 h-4 text-primary" /> Editar Perfil
                  </Link>

                  {/* Panel Shortcut */}
                  {isAdopter && (
                    <Link
                      href="/minhas-candidaturas"
                      role="menuitem"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex min-h-[44px] items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-secondary transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-primary" /> Minhas Candidaturas
                    </Link>
                  )}

                  {isGuardian && (
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex min-h-[44px] items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-secondary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" /> Painel de gestão
                    </Link>
                  )}



                  {/* Logout */}
                  <div className="border-t border-border/50 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      role="menuitem"
                      className="flex min-h-[44px] w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full text-xs min-h-[44px]">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full text-xs bg-primary hover:bg-primary/90 min-h-[44px]">
                <Link href="/cadastro">Cadastrar</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((menuAberto) => !menuAberto);
              setProfileDropdownOpen(false);
              setThemeDropdownOpen(false);
            }}
            className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-border/60 bg-card text-foreground"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="menu-movel"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && typeof document !== "undefined" && createPortal(
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-foreground/30 backdrop-blur-sm sm:top-20 lg:hidden"
          />
          <div
            id="menu-movel"
            className="fixed bottom-0 right-0 top-16 z-50 w-full max-w-sm overflow-y-auto border-l border-border bg-background px-4 py-5 shadow-2xl animate-in slide-in-from-right-4 sm:top-20 sm:px-6 lg:hidden"
          >
          <nav aria-label="Navegação móvel" className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = estaAtivo(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-[48px] items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-primary" />}
                  {link.label}
                </Link>
              );
            })}

            {isAdopter && (
              <Link
                href="/minhas-candidaturas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-secondary"
              >
                <FileCheck2 className="w-4 h-4 text-primary" /> Minhas Candidaturas
              </Link>
            )}

            {isGuardian && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-secondary"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" /> Painel de gestão
              </Link>
            )}
          </nav>

          {/* Mobile User Actions */}
          <div className="pt-2 border-t border-border/50">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-2xl">
                  <div className="w-9 h-9 rounded-full overflow-hidden relative border border-primary/25 bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.avatar ? (
                      <Image
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-4.5 h-4.5 text-sky-700 dark:text-sky-300" />
                    )}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full text-xs font-medium rounded-xl min-h-[44px]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/perfil" className="flex items-center justify-center gap-2">
                    <UserCog className="w-3.5 h-3.5" /> Editar Perfil
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 rounded-xl min-h-[44px]"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Sair da conta
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild className="rounded-xl text-xs min-h-[44px]" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild className="rounded-xl text-xs bg-primary hover:bg-primary/90 min-h-[44px]" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/cadastro">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
