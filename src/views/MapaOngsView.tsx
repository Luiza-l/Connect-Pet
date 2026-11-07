"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, LocateFixed, MapPin, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardOng } from "@/components/ongs/CardOng";
import { MapaOngs } from "@/components/ongs/MapaOngs";
import { obterOngsNoMapa, type OngNoMapa } from "@/lib/ongsMapa";
import { calcularDistanciaKm, type CoordenadasPublicas } from "@/lib/localizacaoOng";
import { normalizarNomeLocalidade } from "@/lib/localidadesIbge";

export function MapaOngsView() {
  const [ongs, setOngs] = useState<OngNoMapa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [visitante, setVisitante] = useState<CoordenadasPublicas | null>(null);
  const [localizando, setLocalizando] = useState(false);
  const [avisoLocalizacao, setAvisoLocalizacao] = useState("");
  const [selecao, setSelecao] = useState<{ id: string; revisao: number } | null>(null);
  const elementoMapa = useRef<HTMLDivElement>(null);
  const consultaAtual = useRef<AbortController | null>(null);
  const revisaoGeolocalizacao = useRef(0);

  const carregar = useCallback(async (atualizacao = true) => {
    consultaAtual.current?.abort();
    const controlador = new AbortController();
    consultaAtual.current = controlador;
    if (atualizacao) { setCarregando(true); setErro(null); }
    try {
      const dados = await obterOngsNoMapa(controlador.signal);
      if (!controlador.signal.aborted) { setOngs(dados); setErro(null); }
    } catch (falha) {
      if (!controlador.signal.aborted) {
        setOngs([]);
        setErro(falha instanceof Error ? falha.message : "Não foi possível carregar as ONGs.");
      }
    } finally {
      if (!controlador.signal.aborted) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const inicializacao = window.setTimeout(() => void carregar(false), 0);
    // Revalida consentimento e contagens ao retornar à aba e periodicamente enquanto visível.
    const atualizar = () => { if (document.visibilityState === "visible") void carregar(); };
    document.addEventListener("visibilitychange", atualizar);
    const intervalo = window.setInterval(atualizar, 60_000);
    return () => { window.clearTimeout(inicializacao); consultaAtual.current?.abort(); revisaoGeolocalizacao.current += 1; window.clearInterval(intervalo); document.removeEventListener("visibilitychange", atualizar); };
  }, [carregar]);

  const estados = useMemo(() => [...new Set(ongs.map((ong) => ong.estado))].sort(), [ongs]);
  const cidades = useMemo(() => [...new Set(ongs.filter((ong) => !estado || ong.estado === estado).map((ong) => ong.cidade))].sort((a, b) => a.localeCompare(b, "pt-BR")), [ongs, estado]);
  const resultados = useMemo(() => {
    const termo = normalizarNomeLocalidade(busca);
    return ongs.filter((ong) => (!estado || ong.estado === estado) && (!cidade || ong.cidade === cidade)
      && (!termo || normalizarNomeLocalidade(`${ong.nome} ${ong.cidade}`).includes(termo)))
      .map((ong) => ({ ong, distancia: visitante ? calcularDistanciaKm(visitante, ong) : undefined }))
      .sort((a, b) => visitante ? a.distancia! - b.distancia! : a.ong.nome.localeCompare(b.ong.nome, "pt-BR"));
  }, [ongs, busca, estado, cidade, visitante]);
  const ongsVisiveis = useMemo(() => resultados.map(({ ong }) => ong), [resultados]);

  const limpar = () => {
    revisaoGeolocalizacao.current += 1;
    setBusca(""); setEstado(""); setCidade(""); setVisitante(null); setSelecao(null); setAvisoLocalizacao(""); setLocalizando(false);
  };
  const localizar = () => {
    if (!navigator.geolocation) { setAvisoLocalizacao("Este navegador não oferece localização. Use a busca por nome ou município."); return; }
    const revisao = ++revisaoGeolocalizacao.current;
    setLocalizando(true);
    setAvisoLocalizacao("");
    navigator.geolocation.getCurrentPosition((posicao) => {
      if (revisao !== revisaoGeolocalizacao.current) return;
      setVisitante({ latitude: posicao.coords.latitude, longitude: posicao.coords.longitude });
      setSelecao(null);
      setLocalizando(false);
      setAvisoLocalizacao("ONGs ordenadas pela distância aproximada. Sua localização fica apenas nesta página.");
    }, (falha) => {
      if (revisao !== revisaoGeolocalizacao.current) return;
      setLocalizando(false);
      setAvisoLocalizacao(falha.code === 1 ? "Localização não autorizada. Você pode continuar pesquisando por nome ou município." : "Sua localização está indisponível. Continue usando a pesquisa manual.");
    }, { enableHighAccuracy: false, timeout: 12_000, maximumAge: 60_000 });
  };

  return (
    <div className="page-shell min-w-0 space-y-6 py-8 sm:py-12">
      <header className="space-y-3"><span className="section-kicker">Uma rede de cuidado perto de você</span><h1 className="page-heading flex items-center gap-3"><MapPin aria-hidden="true" className="size-8 shrink-0 text-primary" />Mapa de ONGs</h1><p className="max-w-2xl text-sm text-muted-foreground sm:text-base">Conheça organizações de proteção animal e encontre os pets que esperam por um lar. As localizações são aproximadas e autorizadas pelas ONGs.</p></header>
      <section aria-label="Pesquisar ONGs" className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row"><div className="relative min-w-0 flex-1"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" /><input aria-label="Buscar ONG pelo nome ou município" placeholder="Nome da ONG ou município" value={busca} onChange={(evento) => { setBusca(evento.target.value); setSelecao(null); }} className="min-h-[44px] w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary" /></div><Button type="button" variant="outline" disabled={localizando} onClick={localizar} className="min-h-[44px] rounded-xl"><LocateFixed aria-hidden="true" className="size-4" />{localizando ? "Localizando..." : "ONGs perto de mim"}</Button><Button type="button" variant="outline" className="min-h-[44px] rounded-xl md:hidden" aria-expanded={filtrosAbertos} aria-controls="filtros-mapa" onClick={() => setFiltrosAbertos((abertos) => !abertos)}><SlidersHorizontal aria-hidden="true" className="size-4" />Filtros</Button></div>
        <div id="filtros-mapa" className={`${filtrosAbertos ? "grid" : "hidden"} grid-cols-1 gap-3 md:grid md:grid-cols-3`}>
          <label className="space-y-1 text-sm font-semibold">Estado<select value={estado} onChange={(evento) => { setEstado(evento.target.value); setCidade(""); setSelecao(null); }} className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-foreground"><option value="">Todos os estados</option>{estados.map((uf) => <option key={uf} value={uf}>{uf}</option>)}</select></label>
          <label className="space-y-1 text-sm font-semibold">Município<select value={cidade} onChange={(evento) => { setCidade(evento.target.value); setSelecao(null); }} className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-foreground"><option value="">Todos os municípios</option>{cidades.map((nome) => <option key={nome} value={nome}>{nome}</option>)}</select></label>
          <Button type="button" variant="ghost" className="min-h-[44px] self-end rounded-xl" onClick={limpar}>Limpar filtros</Button>
        </div>
        {avisoLocalizacao && <p role="status" className="text-sm text-muted-foreground">{avisoLocalizacao}</p>}
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm font-semibold">{carregando ? "Atualizando organizações..." : `${resultados.length} ${resultados.length === 1 ? "organização encontrada" : "organizações encontradas"}`}</p><Button type="button" variant="ghost" disabled={carregando} onClick={() => void carregar()} className="min-h-[44px]">Atualizar ONGs</Button></div>
      {erro && <div role="alert" className="space-y-3 rounded-2xl border border-destructive/30 bg-card p-5"><p>{erro}</p><Button type="button" variant="outline" onClick={() => void carregar()} className="min-h-[44px]">Tentar novamente</Button></div>}
      {carregando && !ongs.length && <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 aria-hidden="true" className="size-5 animate-spin" />Carregando ONGs...</p>}
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <div ref={elementoMapa} className="min-w-0 scroll-mt-24 lg:col-span-2"><MapaOngs ongs={ongsVisiveis} selecao={selecao} visitante={visitante} /><p className="mt-2 text-xs text-muted-foreground">Pontos aproximados, sem indicação de endereço para visitas. Entre em contato com a ONG para combinar uma adoção.</p></div>
        <section aria-label="Lista de ONGs encontradas" className="min-w-0 space-y-3 lg:max-h-[75svh] lg:overflow-y-auto lg:pr-1">
          {!carregando && !erro && !resultados.length && <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-center"><Building2 aria-hidden="true" className="mx-auto size-8 text-primary" /><h2 className="font-bold">Nenhuma ONG encontrada</h2><p className="text-sm text-muted-foreground">{ongs.length ? "Tente outro nome, estado ou município." : "Ainda não há organizações com localização pública autorizada. Volte em breve para conhecer novas ONGs."}</p><Button type="button" variant="outline" onClick={limpar} className="min-h-[44px]">Limpar filtros</Button></div>}
          {resultados.map(({ ong, distancia }) => <CardOng key={ong.id} ong={ong} distancia={distancia} aoVerNoMapa={() => { setSelecao((anterior) => ({ id: ong.id, revisao: (anterior?.revisao || 0) + 1 })); elementoMapa.current?.scrollIntoView({ behavior: "auto", block: "start" }); }} />)}
        </section>
      </div>
    </div>
  );
}
