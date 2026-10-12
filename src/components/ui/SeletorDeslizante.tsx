"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

export interface ItemSeletorDeslizante {
  id: string;
  rotulo: React.ReactNode;
  icone?: React.ComponentType<{ className?: string }>;
  /** Rótulo acessível para itens que exibem apenas o ícone */
  rotuloAcessivel?: string;
  /** Conteúdo extra (ex.: contador) que pode variar conforme o item estiver selecionado */
  extra?: (selecionado: boolean) => React.ReactNode;
}

interface SeletorDeslizanteProps {
  itens: ItemSeletorDeslizante[];
  valor: string;
  aoMudar: (id: string) => void;
  rotuloAria: string;
  /** "alternancia" usa aria-pressed; "abas" usa role="tablist"/"tab" */
  papel?: "alternancia" | "abas";
  /** Classes do contêiner (layout, fundo, borda, padding) */
  className?: string;
  /** Classes do botão (tamanho, tipografia, padding) */
  classeItem?: string;
  /** Classes da pílula deslizante (cor, sombra, raio) */
  classeIndicador?: string;
  /** Classes do texto do item selecionado */
  classeSelecionado?: string;
  /** Classes do texto do item não selecionado */
  classeNaoSelecionado?: string;
}

/**
 * Seletor segmentado com pílula que desliza até a opção selecionada.
 * Reutilizável em alternâncias (login/cadastro) e abas (painel).
 */
export function SeletorDeslizante({
  itens,
  valor,
  aoMudar,
  rotuloAria,
  papel = "alternancia",
  className = "",
  classeItem = "",
  classeIndicador = "bg-background shadow-sm rounded-xl",
  classeSelecionado = "text-primary",
  classeNaoSelecionado = "text-muted-foreground hover:text-foreground",
}: SeletorDeslizanteProps) {
  const contineRef = useRef<HTMLDivElement>(null);
  const refsItens = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicador, setIndicador] = useState({ esquerda: 0, largura: 0, altura: 0, topo: 0, visivel: false });

  useLayoutEffect(() => {
    const atualizar = () => {
      const elemento = refsItens.current[valor];
      if (!elemento) {
        setIndicador((anterior) => (anterior.visivel ? { ...anterior, visivel: false } : anterior));
        return;
      }
      setIndicador({
        esquerda: elemento.offsetLeft,
        largura: elemento.offsetWidth,
        topo: elemento.offsetTop,
        altura: elemento.offsetHeight,
        visivel: true,
      });
    };
    atualizar();
    const observador = new ResizeObserver(atualizar);
    if (contineRef.current) observador.observe(contineRef.current);
    return () => observador.disconnect();
  }, [valor, itens.length]);

  const ehAbas = papel === "abas";

  return (
    <div
      ref={contineRef}
      role={ehAbas ? "tablist" : "group"}
      aria-label={rotuloAria}
      className={`relative ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 transition-[transform,width,height,opacity] duration-300 ease-out motion-reduce:transition-none ${classeIndicador} ${
          indicador.visivel ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: indicador.largura,
          height: indicador.altura,
          transform: `translate(${indicador.esquerda}px, ${indicador.topo}px)`,
        }}
      />
      {itens.map((item) => {
        const selecionado = item.id === valor;
        const Icone = item.icone;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refsItens.current[item.id] = el;
            }}
            type="button"
            aria-label={item.rotuloAcessivel}
            role={ehAbas ? "tab" : undefined}
            aria-selected={ehAbas ? selecionado : undefined}
            aria-pressed={ehAbas ? undefined : selecionado}
            onClick={() => aoMudar(item.id)}
            className={`relative z-10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${classeItem} ${
              selecionado ? classeSelecionado : classeNaoSelecionado
            }`}
          >
            {Icone && <Icone className="h-4 w-4" />}
            {item.rotulo}
            {item.extra?.(selecionado)}
          </button>
        );
      })}
    </div>
  );
}
