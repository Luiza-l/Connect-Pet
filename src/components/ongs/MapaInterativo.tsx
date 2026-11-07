"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { CoordenadasPublicas } from "@/lib/localizacaoOng";
import type { OngNoMapa } from "@/lib/ongsMapa";
import { CardOng } from "./CardOng";
import { Button } from "@/components/ui/button";

export interface MapaInterativoProps {
  ongs?: OngNoMapa[];
  selecao?: { id: string; revisao: number } | null;
  visitante?: CoordenadasPublicas | null;
  ponto?: CoordenadasPublicas | null;
  aoEscolherPonto?: (ponto: CoordenadasPublicas) => void;
}

const ONGS_VAZIAS: OngNoMapa[] = [];
// Enquadramento inicial do Brasil, sem representar a localização de uma ONG.
const CENTRO_BRASIL: L.LatLngTuple = [-14.2, -51.9];
const iconeOng = L.divIcon({
  className: "marcador-ong",
  html: '<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="8" cy="6" rx="2.5" ry="3"/><ellipse cx="16" cy="6" rx="2.5" ry="3"/><ellipse cx="3.5" cy="11" rx="2" ry="2.5"/><ellipse cx="20.5" cy="11" rx="2" ry="2.5"/><path d="M6 17c0-3 4-7 6-7s6 4 6 7c0 4-4 2-6 2s-6 2-6-2Z"/></svg></span>',
  iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -24],
});

function AjustarTamanho() {
  const mapa = useMap();
  useEffect(() => {
    const observador = new ResizeObserver(() => mapa.invalidateSize());
    observador.observe(mapa.getContainer());
    return () => observador.disconnect();
  }, [mapa]);
  return null;
}

function MarcadoresOngs({ ongs, selecao, visitante }: Required<Pick<MapaInterativoProps, "ongs">> & Pick<MapaInterativoProps, "selecao" | "visitante">) {
  const mapa = useMap();
  const grupo = useRef<L.MarkerClusterGroup | null>(null);
  const marcadores = useMemo(() => ongs.map((ong) => {
    const conteudo = document.createElement("div");
    const marcador = L.marker([ong.latitude, ong.longitude], { icon: iconeOng, title: ong.nome, alt: ong.nome });
    marcador.bindPopup(conteudo, { maxWidth: 300, minWidth: 180 });
    return { ong, conteudo, marcador };
  }), [ongs]);

  useEffect(() => {
    const agrupamento = L.markerClusterGroup({
      showCoverageOnHover: false, maxClusterRadius: 55, spiderfyOnMaxZoom: true,
      iconCreateFunction: (aglomerado) => L.divIcon({
        className: "agrupamento-ongs", html: `<span>${aglomerado.getChildCount()}</span>`, iconSize: [48, 48],
      }),
    });
    agrupamento.addLayers(marcadores.map((item) => item.marcador));
    mapa.addLayer(agrupamento);
    grupo.current = agrupamento;
    return () => { grupo.current = null; mapa.removeLayer(agrupamento); };
  }, [mapa, marcadores]);

  useEffect(() => {
    if (visitante) {
      mapa.setView([visitante.latitude, visitante.longitude], 10, { animate: false });
    } else if (ongs.length) {
      mapa.fitBounds(ongs.map((ong) => [ong.latitude, ong.longitude] as L.LatLngTuple), { padding: [36, 36], maxZoom: 12, animate: false });
    } else {
      mapa.setView(CENTRO_BRASIL, 4, { animate: false });
    }
  }, [mapa, ongs, visitante]);

  useEffect(() => {
    if (!selecao) return;
    const item = marcadores.find(({ ong }) => ong.id === selecao.id);
    if (!item || !grupo.current) return;
    mapa.setView(item.marcador.getLatLng(), 15, { animate: false });
    grupo.current.zoomToShowLayer(item.marcador, () => item.marcador.openPopup());
  }, [mapa, marcadores, selecao]);

  return <>{marcadores.map(({ ong, conteudo }) => createPortal(<CardOng ong={ong} compacta />, conteudo, ong.id))}</>;
}

function EscolherPonto({ ponto, aoEscolherPonto }: Pick<MapaInterativoProps, "ponto" | "aoEscolherPonto">) {
  const mapa = useMapEvents({
    click: (evento) => {
      // O ponto publicado tem precisão reduzida; não registra coordenadas exatas do abrigo.
      aoEscolherPonto?.({ latitude: Number(evento.latlng.lat.toFixed(3)), longitude: Number(evento.latlng.lng.toFixed(3)) });
    },
  });
  useEffect(() => {
    if (ponto) mapa.setView([ponto.latitude, ponto.longitude], Math.max(mapa.getZoom(), 12), { animate: false });
  }, [mapa, ponto]);
  return ponto ? <Marker position={[ponto.latitude, ponto.longitude]} icon={iconeOng} title="Localização aproximada que será exibida" /> : null;
}

export default function MapaInterativo({ ongs = ONGS_VAZIAS, selecao, visitante, ponto, aoEscolherPonto }: MapaInterativoProps) {
  const [falhaTiles, setFalhaTiles] = useState(false);
  const [revisaoTiles, setRevisaoTiles] = useState(0);
  return (
    <div className="mapa-ongs relative isolate min-h-[55svh] w-full overflow-hidden rounded-2xl border border-border bg-muted lg:min-h-[65svh]" role="region" aria-label={aoEscolherPonto ? "Escolha uma localização aproximada no mapa" : "Mapa interativo de ONGs"}>
      <MapContainer center={CENTRO_BRASIL} zoom={4} minZoom={3} maxZoom={18} scrollWheelZoom={false} className="absolute inset-0 size-full" zoomControl={false}>
        <TileLayer key={revisaoTiles} url={process.env.NEXT_PUBLIC_MAPA_TILES_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' eventHandlers={{ tileerror: () => setFalhaTiles(true) }} />
        <ControlesZoom />
        <AjustarTamanho />
        {aoEscolherPonto ? <EscolherPonto ponto={ponto} aoEscolherPonto={aoEscolherPonto} /> : <MarcadoresOngs ongs={ongs} selecao={selecao} visitante={visitante} />}
        {visitante && <CircleMarker center={[visitante.latitude, visitante.longitude]} radius={9} pathOptions={{ className: "posicao-visitante" }} />}
      </MapContainer>
      {falhaTiles && <div role="alert" className="absolute inset-x-3 top-3 z-[1000] space-y-2 rounded-xl border border-border bg-card p-3 text-sm text-foreground shadow-md"><p>O fundo do mapa não carregou. Você pode continuar usando a lista de ONGs.</p><Button type="button" variant="outline" className="min-h-[44px]" onClick={() => { setFalhaTiles(false); setRevisaoTiles((valor) => valor + 1); }}>Recarregar mapa</Button></div>}
    </div>
  );
}

function ControlesZoom() {
  const mapa = useMap();
  useEffect(() => {
    const controle = L.control.zoom({ position: "bottomright", zoomInTitle: "Aproximar mapa", zoomOutTitle: "Afastar mapa" }).addTo(mapa);
    return () => { controle.remove(); };
  }, [mapa]);
  return null;
}
