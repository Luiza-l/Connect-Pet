"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "react-aria-components";
import { Bell, FileText, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/client";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";

type Aviso = {
  tipo: "candidatura" | "mensagem_candidatura" | "conversa";
  destino: string;
  animal: string | null;
};

export function NotificacoesGuardiao({ usuario }: { usuario: string }) {
  const router = useRouter();
  const { reloadApplications } = useApp();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [estado, setEstado] = useState<"carregando" | "pronto" | "erro">("carregando");

  useEffect(() => {
    const banco = createClient();
    let consulta: AbortController | undefined;
    async function atualizar() {
      if (document.hidden) return;
      consulta?.abort();
      const atual = new AbortController();
      consulta = atual;
      const { data, error } = await banco.from("avisos_guardiao")
        .select("tipo,destino,animal").eq("guardiao_id", usuario)
        .order("recebido_em", { ascending: false }).order("destino").limit(21)
        .abortSignal(atual.signal);
      if (atual.signal.aborted) return;
      if (!error) setAvisos(data as Aviso[]);
      setEstado(error ? "erro" : "pronto");
    }
    void atualizar();
    const intervalo = window.setInterval(atualizar, 15000);
    document.addEventListener("visibilitychange", atualizar);
    window.addEventListener("avisos-guardiao-atualizados", atualizar);
    return () => {
      consulta?.abort();
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", atualizar);
      window.removeEventListener("avisos-guardiao-atualizados", atualizar);
    };
  }, [usuario]);

  const quantidade = avisos.length > 20 ? "20+" : String(avisos.length);
  return (
    <DropdownMenuTrigger>
      <Button className="relative grid min-h-11 min-w-11 place-items-center rounded-full text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
        aria-label={`Notificações (${quantidade})`} aria-live="polite">
        <Bell aria-hidden="true" className="size-5" />
        {avisos.length > 0 && <span className="absolute end-0 top-0 rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">{quantidade}</span>}
      </Button>
      <DropdownMenu aria-label="Notificações" placement="bottom end" className="w-72 max-w-[90vw]">
        {estado !== "pronto" || !avisos.length ? (
          <DropdownMenuItem isDisabled className="p-3">
            {estado === "erro" ? "Não foi possível atualizar os avisos." : estado === "carregando" ? "Carregando avisos…" : "Nenhuma notificação nova."}
          </DropdownMenuItem>
        ) : null}
        {avisos.slice(0, 20).map((aviso) => {
          const candidatura = aviso.tipo === "candidatura";
          const titulo = candidatura ? "Nova candidatura" : aviso.tipo === "conversa" ? "Mensagem sobre o pet" : "Mensagem na candidatura";
          const Icone = candidatura ? FileText : MessageCircle;
          return <DropdownMenuItem key={aviso.tipo + aviso.destino} textValue={titulo + " " + (aviso.animal ?? "")}
            className="min-h-11 gap-3 p-3" onAction={() => {
              const id = encodeURIComponent(aviso.destino);
              if (aviso.tipo === "conversa") router.push(`/mensagens?conversa=${id}`);
              else {
                reloadApplications();
                router.push(`/dashboard?aba=candidaturas&candidatura=${id}&detalhe=${candidatura ? "formulario" : "mensagens"}`);
              }
            }}>
            <Icone aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <span className="min-w-0"><strong className="block">{titulo}</strong><span className="break-words text-muted-foreground">{aviso.animal}</span></span>
          </DropdownMenuItem>;
        })}
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
