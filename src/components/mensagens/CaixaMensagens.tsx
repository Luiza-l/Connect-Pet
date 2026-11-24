"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { normalizarFotosPet } from "@/lib/origensImagem";
import type { CaixaPet, ConversaPet, MensagemPet } from "@/lib/conversasPet";

const formatarData = (valor: string) => new Date(valor).toLocaleString("pt-BR", {
  day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
});

function Foto({ conversa }: { conversa: ConversaPet }) {
  return <Image src={normalizarFotosPet(conversa.fotos)[0]} alt="" width={48} height={48}
    className="size-12 shrink-0 rounded-xl bg-muted object-cover" />;
}

function Historico({ conversa, usuario, mensagens, caixa, atualizar, aoVoltar, responsavel }: {
  conversa: ConversaPet; usuario: string; mensagens: MensagemPet[] | null; caixa: CaixaPet;
  atualizar: () => void; aoVoltar: () => void; responsavel: boolean;
}) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");
  const tentativa = useRef<{ id: string; conteudo: string } | null>(null);
  const trava = useRef(false);
  const rolagem = useRef<HTMLDivElement>(null);
  const acompanhar = useRef(true);
  const ultima = mensagens?.at(-1)?.id;
  useEffect(() => {
    const area = rolagem.current;
    if (area && acompanhar.current) area.scrollTop = area.scrollHeight;
  }, [ultima]);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || trava.current) return;
    trava.current = true;
    setEnviando(true);
    setAviso("");
    try {
      if (tentativa.current?.conteudo !== conteudo) tentativa.current = { id: crypto.randomUUID(), conteudo };
      await caixa.enviar(conversa.id, tentativa.current.id, conteudo);
      tentativa.current = null;
      acompanhar.current = true;
      setTexto("");
      setAviso("Mensagem enviada.");
      atualizar();
    } catch {
      setAviso("Não foi possível confirmar o envio. Tente enviar novamente.");
    } finally {
      trava.current = false;
      setEnviando(false);
    }
  }

  return <section aria-label={`Conversa sobre ${conversa.nome_pet}`} className="min-w-0 bg-card">
    <header className="flex flex-wrap items-center gap-3 border-b border-border p-3 sm:p-4">
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Voltar às conversas" onClick={aoVoltar}><ArrowLeft /></Button>
      <Foto conversa={conversa} />
      <div className="min-w-0 flex-1 wrap-anywhere">
        <h2 className="font-serif text-xl font-bold">{conversa.nome_pet}</h2>
        <p className="text-sm text-muted-foreground">{conversa.nome_responsavel}</p>
        {responsavel && <p className="text-sm">Interessado(a): {conversa.nome_interessado}</p>}
      </div>
    </header>
    <div ref={rolagem} role="region" tabIndex={0} aria-label="Histórico de mensagens"
      onScroll={(e) => { const area = e.currentTarget; acompanhar.current = area.scrollHeight - area.scrollTop - area.clientHeight < 80; }}
      className="flex h-[46dvh] min-h-48 flex-col gap-3 overflow-y-auto bg-background/60 p-3 sm:p-5">
      {mensagens === null ? <p role="status">Carregando histórico…</p> : mensagens.length === 0
        ? <p className="m-auto text-center text-sm text-muted-foreground">Comece a conversa sobre {conversa.nome_pet}.</p>
        : mensagens.map((mensagem) => {
          const propria = mensagem.remetente_id === usuario;
          return <div key={mensagem.id} className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm sm:max-w-[80%] ${propria
            ? "self-end rounded-br-sm bg-primary text-primary-foreground" : "self-start rounded-bl-sm border border-border bg-card text-card-foreground"}`}>
            <span className="sr-only">{propria ? "Você" : responsavel ? conversa.nome_interessado : conversa.nome_responsavel}</span>
            <p className="whitespace-pre-wrap wrap-anywhere">{mensagem.conteudo}</p>
            <time dateTime={mensagem.enviada_em} className="mt-1 block text-right text-xs">{formatarData(mensagem.enviada_em)}</time>
          </div>;
        })}
    </div>
    <form onSubmit={enviar} className="space-y-2 border-t border-border p-3 sm:p-4">
      <label className="text-sm font-semibold" htmlFor="texto-conversa">Sua mensagem</label>
      <Textarea id="texto-conversa" rows={2} maxLength={4000} value={texto} disabled={enviando}
        onChange={(e) => { setTexto(e.target.value); setAviso(""); }}
        placeholder={responsavel ? "Escreva uma resposta…" : "Escreva sua dúvida…"} className="max-h-40 min-h-14 resize-y" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span role="status" className="text-sm text-muted-foreground">{aviso}</span>
        <Button type="submit" disabled={!texto.trim() || enviando}><Send />{enviando ? "Enviando…" : "Enviar"}</Button>
      </div>
    </form>
  </section>;
}

export function CaixaMensagens({ caixa, usuario, responsavel, inicial = null, aoSelecionar }: {
  caixa: CaixaPet; usuario: string; responsavel: boolean; inicial?: string | null;
  aoSelecionar?: (id: string | null) => void;
}) {
  const [aberta, setAberta] = useState(inicial);
  const [conversas, setConversas] = useState<ConversaPet[] | null>(null);
  const [historico, setHistorico] = useState<{ conversa: string; linhas: MensagemPet[] } | null>(null);
  const [erro, setErro] = useState("");
  const atualizar = useRef<() => void>(() => {});

  function selecionar(id: string | null) {
    setAberta(id);
    aoSelecionar?.(id);
  }

  useEffect(() => {
    let ativo = true;
    let consultando = false;
    let pendente = false;
    // Eventos simultâneos geram no máximo uma nova consulta após a que está em andamento.
    async function sincronizar() {
      if (!ativo || document.hidden) return;
      if (consultando) { pendente = true; return; }
      consultando = true;
      try {
        const lista = await caixa.listar();
        if (!ativo) return;
        setConversas(lista);
        if (aberta && lista.some((c) => c.id === aberta)) {
          const linhas = await caixa.historico(aberta);
          if (!ativo) return;
          setHistorico({ conversa: aberta, linhas });
          const recebida = linhas.findLast((m) => !m.lida && m.remetente_id !== usuario);
          if (recebida && !document.hidden) {
            await caixa.ler(aberta, recebida.enviada_em);
            if (!ativo) return;
            setConversas(lista.map((c) => c.id === aberta ? { ...c, nao_lida: false } : c));
          }
        }
        setErro("");
      } catch {
        if (ativo) setErro("Não foi possível atualizar as mensagens. Verifique sua conexão.");
      } finally {
        consultando = false;
        if (ativo && pendente) { pendente = false; void sincronizar(); }
      }
    }
    atualizar.current = sincronizar;
    void sincronizar();
    const parar = caixa.observar(sincronizar);
    // Recupera eventos perdidos durante uma desconexão ou com a aba em segundo plano.
    const intervalo = window.setInterval(sincronizar, 30000);
    document.addEventListener("visibilitychange", sincronizar);
    window.addEventListener("online", sincronizar);
    return () => {
      ativo = false;
      parar();
      window.clearInterval(intervalo);
      window.removeEventListener("online", sincronizar);
      document.removeEventListener("visibilitychange", sincronizar);
    };
  }, [aberta, caixa, usuario]);

  const selecionada = conversas?.find((c) => c.id === aberta);
  return <div className="min-w-0 space-y-3">
    {erro && <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 text-sm">
      {erro}<Button variant="outline" onClick={() => atualizar.current()}>Tentar novamente</Button>
    </div>}
    <div className="grid min-w-0 grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <section aria-label="Conversas" className={`min-w-0 md:block md:border-r md:border-border ${aberta ? "hidden" : ""}`}>
        <h2 className="border-b border-border p-4 font-semibold">Conversas</h2>
        <div className="max-h-[68dvh] overflow-y-auto">
          {conversas?.map((c) => <button type="button" key={c.id} aria-pressed={aberta === c.id}
            onClick={() => selecionar(c.id)} className={`flex w-full items-start gap-3 border-b border-border p-3 text-left hover:bg-muted focus-visible:outline-offset-[-3px] sm:p-4 ${aberta === c.id ? "bg-secondary" : ""}`}>
            <Foto conversa={c} />
            <span className="min-w-0 flex-1">
              <strong className="block wrap-anywhere">{c.nome_pet}</strong>
              <span className="block truncate text-sm">{responsavel ? c.nome_interessado : c.nome_responsavel}</span>
              <span className="block truncate text-xs text-muted-foreground">{c.ultima_mensagem ?? "Conversa iniciada"}</span>
              <time dateTime={c.atividade_em} className="text-xs text-muted-foreground">{formatarData(c.atividade_em)}</time>
              {c.nao_lida && <span className="ml-2 inline-block text-xs font-semibold text-primary">Não lida</span>}
            </span>
          </button>)}
          {!conversas?.length && <p role="status" className="p-4 text-sm text-muted-foreground">{conversas ? "Ainda não há conversas." : erro ? "Lista indisponível." : "Carregando conversas…"}</p>}
        </div>
      </section>
      {selecionada ? <Historico key={selecionada.id} usuario={usuario} conversa={selecionada} responsavel={responsavel}
        mensagens={historico?.conversa === aberta ? historico.linhas : null} caixa={caixa}
        atualizar={() => atualizar.current()} aoVoltar={() => selecionar(null)} />
        : <div className={`min-h-52 flex-col items-center justify-center gap-3 p-4 text-center text-sm text-muted-foreground md:flex ${aberta ? "flex" : "hidden"}`}>
          <MessageCircle aria-hidden="true" />
          {aberta ? conversas ? "Conversa indisponível." : "Buscando conversa…" : "Selecione uma conversa para ver as mensagens."}
          {aberta && <Button variant="outline" onClick={() => selecionar(null)}>Voltar à lista</Button>}
        </div>}
    </div>
  </div>;
}
