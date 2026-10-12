"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SELETOR_REVELACAO =
  "section, article, [data-slot='card'], [data-revelar]";

function deveRevelar(elemento: HTMLElement) {
  if (elemento.hasAttribute("data-revelar")) {
    return true;
  }

  const dentroDeArtigo = elemento.parentElement?.closest("article");
  const dentroDeCard = elemento.parentElement?.closest("[data-slot='card']");

  if (dentroDeArtigo || dentroDeCard) {
    return false;
  }

  if (
    elemento.tagName === "SECTION" &&
    elemento.querySelector("article, [data-slot='card']")
  ) {
    return false;
  }

  return true;
}

function obterAtraso(elemento: HTMLElement) {
  const pai = elemento.parentElement;

  if (!pai) {
    return 0;
  }

  const irmaos = Array.from(pai.children).filter(
    (irmao): irmao is HTMLElement =>
      irmao instanceof HTMLElement &&
      irmao.matches(SELETOR_REVELACAO) &&
      deveRevelar(irmao)
  );

  return Math.min(Math.max(irmaos.indexOf(elemento), 0), 4) * 35;
}

interface AnimacoesDaPaginaProps {
  children: React.ReactNode;
}

export function AnimacoesDaPagina({ children }: AnimacoesDaPaginaProps) {
  const caminho = usePathname();
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;

    if (!raiz) {
      return;
    }

    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (movimentoReduzido || !("IntersectionObserver" in window)) {
      return;
    }

    const processados = new WeakSet<HTMLElement>();
    const elementosPendentes = new Set<HTMLElement>();
    let quadroPendente: number | undefined;

    const observadorIntersecao = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) {
            return;
          }

          const elemento = entrada.target as HTMLElement;
          elemento.classList.add("revelado");
          observadorIntersecao.unobserve(elemento);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      }
    );

    const registrarElementos = (
      escopo: ParentNode,
      revelarVisiveisSemAnimacao = false
    ) => {
      const candidatos = [
        ...(escopo instanceof HTMLElement &&
        escopo.matches(SELETOR_REVELACAO)
          ? [escopo]
          : []),
        ...escopo.querySelectorAll<HTMLElement>(SELETOR_REVELACAO),
      ];

      candidatos.forEach((elemento) => {
        if (processados.has(elemento) || !deveRevelar(elemento)) {
          return;
        }

        processados.add(elemento);
        elemento.style.setProperty(
          "--atraso-revelacao",
          `${obterAtraso(elemento)}ms`
        );
        elemento.classList.add("revelar-ao-rolar");

        const limites = elemento.getBoundingClientRect();
        const jaVisivel =
          limites.top < window.innerHeight * 0.92 && limites.bottom > 0;

        if (revelarVisiveisSemAnimacao && jaVisivel) {
          elemento.classList.add("revelado");
          return;
        }

        observadorIntersecao.observe(elemento);
      });

    };

    registrarElementos(raiz, true);

    const observadorMutacoes = new MutationObserver((mutacoes) => {
      mutacoes.forEach((mutacao) => {
        mutacao.addedNodes.forEach((noAdicionado) => {
          if (noAdicionado instanceof HTMLElement) {
            elementosPendentes.add(noAdicionado);
          }
        });
      });

      if (elementosPendentes.size === 0) {
        return;
      }

      if (quadroPendente !== undefined) {
        cancelAnimationFrame(quadroPendente);
      }

      quadroPendente = requestAnimationFrame(() => {
        elementosPendentes.forEach((elemento) => registrarElementos(elemento));
        elementosPendentes.clear();
        quadroPendente = undefined;
      });
    });

    observadorMutacoes.observe(raiz, {
      childList: true,
      subtree: true,
    });

    return () => {
      observadorIntersecao.disconnect();
      observadorMutacoes.disconnect();

      if (quadroPendente !== undefined) {
        cancelAnimationFrame(quadroPendente);
      }
    };
  }, [caminho]);

  return (
    <div key={caminho} ref={raizRef} className="transicao-rota">
      {children}
    </div>
  );
}
