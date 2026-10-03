"use client";

import React, { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { Heart, LogIn, UserPlus, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { AUTH_FEATURES, sanitizeRedirect, type AuthFeature } from "./auth-features";

const FEATURE_ICONS: Record<AuthFeature, React.ComponentType<{ className?: string }>> = {
  favorites: Heart,
  default: LogIn,
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal global de "acesso restrito". Montado uma única vez no layout;
 * qualquer tela o aciona via `requireAuth(feature)` do `useApp()`.
 */
export function AuthRequiredDialog() {
  const { authPrompt, closeAuthPrompt, currentUser } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);
  const titleId = useId();
  const descId = useId();

  const isOpen = Boolean(authPrompt) && !currentUser;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAuthPrompt();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, closeAuthPrompt]);

  if (!isOpen || !authPrompt) return null;

  const content = AUTH_FEATURES[authPrompt.feature] ?? AUTH_FEATURES.default;
  const Icon = FEATURE_ICONS[authPrompt.feature] ?? LogIn;

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
  const redirect = encodeURIComponent(sanitizeRedirect(authPrompt.redirectTo ?? currentPath));

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuthPrompt();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md bg-card text-card-foreground rounded-3xl border border-border shadow-2xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95"
      >
        <button
          type="button"
          onClick={closeAuthPrompt}
          aria-label="Fechar aviso"
          className="absolute top-3 right-3 inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 id={titleId} className="font-serif text-2xl font-bold text-foreground leading-tight">
            {content.title}
          </h2>
          <p id={descId} className="text-sm text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Button
            asChild
            size="lg"
            className="w-full min-h-[44px] rounded-full font-bold shadow-lg shadow-primary/20"
          >
            <Link ref={primaryRef} href={`/login?redirect=${redirect}`} onClick={closeAuthPrompt}>
              <LogIn className="w-4 h-4" /> Entrar
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full min-h-[44px] rounded-full font-semibold"
          >
            <Link href={`/cadastro?redirect=${redirect}`} onClick={closeAuthPrompt}>
              <UserPlus className="w-4 h-4" /> Criar conta
            </Link>
          </Button>
          <button
            type="button"
            onClick={closeAuthPrompt}
            className="min-h-[44px] rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
