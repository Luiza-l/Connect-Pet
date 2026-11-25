"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { abrirConversaPet, obterCaixaPet } from "@/lib/conversasPet";
import { CaixaMensagens } from "./CaixaMensagens";
import { Button } from "@/components/ui/button";
import { registrarErroSeguro } from "@/lib/mensagensErro";

export function MensagensReais({ inicial, pet }: { inicial?: string; pet?: string }) {
  const { currentUser, authLoading } = useApp();
  const router = useRouter();
  const usuario = currentUser?.id;
  const papel = currentUser?.role;
  const caixa = useMemo(() => usuario ? obterCaixaPet(usuario) : null, [usuario]);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    if (!usuario || papel !== "adopter" || !pet) return;
    let ativo = true;
    abrirConversaPet(pet).then((id) => {
      if (ativo) router.replace(`/mensagens?conversa=${encodeURIComponent(id)}`);
    }).catch((falha) => {
      registrarErroSeguro("Falha ao abrir conversa sobre o animal", falha);
      if (ativo) setErro(true);
    });
    return () => { ativo = false; };
  }, [pet, usuario, papel, tentativa, router]);

  if (authLoading) return <p role="status">Verificando sessão…</p>;
  if (!currentUser || !caixa) {
    const destino = pet ? `/mensagens?pet=${encodeURIComponent(pet)}` : inicial ? `/mensagens?conversa=${encodeURIComponent(inicial)}` : "/mensagens";
    return <div className="space-y-3"><p>Entre na sua conta para conversar sobre um pet.</p>
      <Button asChild><Link href={`/login?redirect=${encodeURIComponent(destino)}`}>Entrar</Link></Button></div>;
  }
  if (pet) {
    if (papel !== "adopter") return <p>Use uma conta de adotante para iniciar uma conversa sobre este pet.</p>;
    return erro ? <div role="alert" className="space-y-3"><p>Não foi possível abrir a conversa. Confira se o anúncio continua disponível.</p>
      <Button variant="outline" onClick={() => { setErro(false); setTentativa(t => t + 1); }}>Tentar novamente</Button></div>
      : <p role="status">Abrindo conversa…</p>;
  }
  return <CaixaMensagens key={`${usuario}-${inicial ?? ""}`} caixa={caixa} usuario={currentUser.id}
    responsavel={papel === "guardian"} inicial={inicial} aoSelecionar={id => {
      const endereco = new URL(window.location.href);
      if (id) endereco.searchParams.set("conversa", id);
      else endereco.searchParams.delete("conversa");
      window.history.replaceState(null, "", endereco);
    }} />;
}
