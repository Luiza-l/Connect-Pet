"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OngNoMapa } from "@/lib/ongsMapa";

export function CardOng({ ong, distancia, aoVerNoMapa, compacta = false }: {
  ong: OngNoMapa;
  distancia?: number;
  aoVerNoMapa?: () => void;
  compacta?: boolean;
}) {
  return (
    <article className={`min-w-0 space-y-3 text-foreground ${compacta ? "p-1" : "rounded-2xl border border-border bg-card p-4 shadow-sm"}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
          {ong.avatar ? <Image src={ong.avatar} alt={`Logotipo de ${ong.nome}`} fill sizes="48px" className="object-cover" /> : <Building2 aria-hidden="true" className="size-6" />}
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-base font-bold">{ong.nome}</h2>
          <p className="text-sm text-muted-foreground">{ong.cidade}, {ong.estado}</p>
          {distancia !== undefined && <p className="text-xs font-semibold text-primary">Aprox. {distancia.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km em linha reta</p>}
        </div>
      </div>
      {ong.descricao && <p className="line-clamp-3 break-words text-sm text-muted-foreground">{ong.descricao}</p>}
      <p className="flex items-start gap-2 text-sm font-medium"><PawPrint aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />{ong.petsDisponiveis > 0 ? `${ong.petsDisponiveis} ${ong.petsDisponiveis === 1 ? "pet disponível" : "pets disponíveis"}` : "Nenhum pet disponível no momento"}</p>
      <div className="flex flex-col gap-2">
        {aoVerNoMapa && <Button type="button" variant="outline" onClick={aoVerNoMapa} className="min-h-[44px] w-full whitespace-normal rounded-xl"><MapPin aria-hidden="true" className="size-4" />Ver no mapa</Button>}
        {ong.petsDisponiveis > 0 ? <Button asChild className="min-h-[44px] w-full whitespace-normal rounded-xl"><Link href={`/pets?ong=${encodeURIComponent(ong.id)}`}>Ver pets disponíveis</Link></Button> : <Button disabled className="min-h-[44px] w-full whitespace-normal rounded-xl">Sem pets disponíveis</Button>}
      </div>
    </article>
  );
}
