"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MapaInterativoProps } from "./MapaInterativo";

const MapaCliente = dynamic(() => import("./MapaInterativo"), {
  ssr: false,
  loading: () => <div role="status" className="flex min-h-[55svh] items-center justify-center gap-2 rounded-2xl border border-border bg-muted text-muted-foreground"><Loader2 aria-hidden="true" className="size-5 animate-spin" />Carregando mapa...</div>,
});

class ProtecaoMapa extends Component<{ children: ReactNode }, { falhou: boolean }> {
  state = { falhou: false };
  static getDerivedStateFromError() { return { falhou: true }; }
  render() {
    if (this.state.falhou) return <div role="alert" className="space-y-3 rounded-2xl border border-border bg-card p-5 text-foreground"><p>Não foi possível abrir o mapa. A pesquisa e a lista continuam disponíveis.</p><Button type="button" variant="outline" className="min-h-[44px]" onClick={() => this.setState({ falhou: false })}>Tentar abrir novamente</Button></div>;
    return this.props.children;
  }
}

export function MapaOngs(props: MapaInterativoProps) {
  return <ProtecaoMapa><MapaCliente {...props} /></ProtecaoMapa>;
}
