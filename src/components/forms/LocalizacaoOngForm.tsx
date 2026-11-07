"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapaOngs } from "@/components/ongs/MapaOngs";
import { geocodificarMunicipio } from "@/lib/ongsMapa";
import type { LocalizacaoOng } from "@/lib/localizacaoOng";

export function LocalizacaoOngForm({ cidade, estado, valor, aoAlterar, desabilitado = false }: {
  cidade: string; estado: string; valor: LocalizacaoOng;
  aoAlterar: (valor: LocalizacaoOng) => void; desabilitado?: boolean;
}) {
  const [mostrarMapa, setMostrarMapa] = useState(Boolean(valor.ponto));
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const revisao = useRef(0);
  const valorAtual = useRef(valor);
  useEffect(() => { valorAtual.current = valor; }, [valor]);
  useEffect(() => { return () => { revisao.current += 1; }; }, [cidade, estado]);

  const buscarCentro = async () => {
    if (buscando || desabilitado) return;
    const consultaAtual = ++revisao.current;
    setBuscando(true);
    setErro(null);
    try {
      const ponto = await geocodificarMunicipio(cidade, estado);
      if (consultaAtual !== revisao.current) return;
      aoAlterar({ ...valorAtual.current, ponto, confirmada: false });
      setMostrarMapa(true);
    } catch (falha) {
      if (consultaAtual === revisao.current) setErro(falha instanceof Error ? falha.message : "Não foi possível localizar o município. Você pode escolher uma região no mapa.");
    } finally {
      if (consultaAtual === revisao.current) setBuscando(false);
    }
  };

  return (
    <fieldset disabled={desabilitado} className="min-w-0 space-y-4 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
      <legend className="px-2 font-bold text-foreground">Localização da ONG (opcional)</legend>
      <p className="text-muted-foreground">Sua ONG pode usar a plataforma sem aparecer no mapa. Escolha um ponto aproximado, como o centro do município, para preservar locais de acolhimento sigilosos.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-foreground"><span>CEP (privado, opcional)</span><input aria-label="CEP privado" value={valor.cep} inputMode="numeric" maxLength={9} onChange={(evento) => { const digitos = evento.target.value.replace(/\D/g, "").slice(0, 8); aoAlterar({ ...valor, cep: digitos.replace(/^(\d{5})(\d)/, "$1-$2") }); }} className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="space-y-2 text-foreground"><span>Endereço completo (privado, opcional)</span><input aria-label="Endereço completo privado" value={valor.enderecoPrivado} maxLength={300} onChange={(evento) => aoAlterar({ ...valor, enderecoPrivado: evento.target.value })} className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3" /></label>
      </div>
      <p className="text-xs text-muted-foreground">CEP e endereço completo ficam restritos à sua conta e não são enviados ao serviço de geocodificação.</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="button" variant="outline" disabled={buscando || !cidade || !estado} onClick={() => void buscarCentro()} className="min-h-[44px] whitespace-normal rounded-xl">{buscando ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <MapPin aria-hidden="true" className="size-4" />}Localizar centro do município</Button>
        <Button type="button" variant="ghost" disabled={!cidade || !estado} onClick={() => setMostrarMapa((anterior) => !anterior)} className="min-h-[44px] whitespace-normal rounded-xl">{mostrarMapa ? "Recolher mapa" : "Escolher região no mapa"}</Button>
      </div>
      {erro && <p role="alert" className="text-destructive">{erro}</p>}
      {mostrarMapa && <div className="space-y-3"><p className="text-muted-foreground">Clique no mapa para ajustar o ponto público. Evite marcar um endereço residencial ou abrigo sigiloso.</p><MapaOngs ponto={valor.ponto} aoEscolherPonto={(ponto) => { if (!desabilitado) aoAlterar({ ...valor, ponto, confirmada: false }); }} /><p className="text-xs text-muted-foreground">Geocodificação: <a href="https://photon.komoot.io" target="_blank" rel="noreferrer" className="underline">Photon</a>, dados © OpenStreetMap.</p></div>}
      {valor.ponto && <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl bg-background p-3"><input type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={valor.confirmada} onChange={(evento) => aoAlterar({ ...valor, confirmada: evento.target.checked })} /><span>Confirmei a prévia e este ponto aproximado pode representar a ONG publicamente.</span></label>}
      <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-3"><input type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={valor.publica} onChange={(evento) => aoAlterar({ ...valor, publica: evento.target.checked })} /><span>Autorizo a exibição desta localização aproximada no Mapa de ONGs. Posso desativar a autorização pelo meu perfil.</span></label>
      {valor.ponto && <Button type="button" variant="ghost" className="min-h-[44px] whitespace-normal" onClick={() => aoAlterar({ ...valor, ponto: null, publica: false, confirmada: false })}>Remover ponto do mapa</Button>}
    </fieldset>
  );
}
