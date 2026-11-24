"use client";

import { useState } from "react";
import { CaixaMensagens } from "@/components/mensagens/CaixaMensagens";
import type { CaixaPet, ConversaPet, MensagemPet } from "@/lib/conversasPet";

const responsavel = "ong-demonstrativa";

// A fonte existe apenas enquanto a demonstração estiver aberta.
function criarCaixaDemonstrativa(): CaixaPet {
  const nomeResponsavel = "ONG Patas Amigas";
  const exemplos = [
    { id: "demo-lua", pet: "Lua", foto: "card-cat-tabby.png", pessoa: "Ana", texto: "A Lua convive bem com outros gatos?" },
    { id: "demo-bento", pet: "Bento", foto: "card-beagle.png", pessoa: "Rafael", texto: "Posso conhecer o Bento no sábado?" },
  ];
  const conversas: ConversaPet[] = [];
  const historicos = new Map<string, MensagemPet[]>();
  exemplos.forEach((e, indice) => {
    const data = new Date(Date.now() - (indice + 1) * 3600000).toISOString();
    conversas.push({ id: e.id, nome_pet: e.pet, fotos: [`/images/home/${e.foto}`], nome_responsavel: nomeResponsavel,
      nome_interessado: e.pessoa, ultima_mensagem: e.texto, atividade_em: data, nao_lida: true });
    historicos.set(e.id, [{ id: e.id, conteudo: e.texto, remetente_id: e.pessoa, enviada_em: data, lida: false }]);
  });
  return {
    async listar() { return conversas.map(c => ({ ...c })).sort((a, b) => b.atividade_em.localeCompare(a.atividade_em)); },
    async historico(id) { return [...(historicos.get(id) ?? [])]; },
    async enviar(conversa, id, conteudo) {
      const linhas = historicos.get(conversa);
      const resumo = conversas.find(c => c.id === conversa);
      if (!linhas || !resumo) throw new Error("Conversa de teste indisponível.");
      if (linhas.some(m => m.id === id)) return;
      const data = new Date().toISOString();
      linhas.push({ id, remetente_id: responsavel, conteudo, enviada_em: data, lida: false });
      resumo.atividade_em = data;
      resumo.ultima_mensagem = conteudo;
    },
    async ler(id) {
      const resumo = conversas.find(c => c.id === id);
      if (resumo) resumo.nao_lida = false;
      historicos.get(id)?.forEach(m => { if (m.remetente_id !== responsavel) m.lida = true; });
    },
    observar: () => () => {},
  };
}

export default function DemonstracaoOng() {
  const [caixa] = useState(criarCaixaDemonstrativa);
  return <div className="mx-auto w-full max-w-6xl space-y-5 px-3 py-6 sm:px-6 lg:py-10">
    <div className="space-y-1">
      <p className="text-sm font-semibold text-primary">Painel da ONG · Demonstração</p>
      <h1 className="font-serif text-3xl font-bold">Mensagens</h1>
      <p className="text-sm text-muted-foreground">Converse com interessados fictícios. As respostas de teste são descartadas ao recarregar.</p>
    </div>
    <CaixaMensagens caixa={caixa} usuario={responsavel} responsavel />
  </div>;
}
