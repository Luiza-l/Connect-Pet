import { createClient } from "@/lib/client";

export interface ConversaPet {
  id: string;
  nome_pet: string;
  fotos: string[] | null;
  nome_responsavel: string;
  nome_interessado: string;
  ultima_mensagem: string | null;
  atividade_em: string;
  nao_lida: boolean;
}

export interface MensagemPet {
  id: string;
  remetente_id: string;
  conteudo: string;
  enviada_em: string;
  lida: boolean;
}

export interface CaixaPet {
  listar(): Promise<ConversaPet[]>;
  historico(conversa: string): Promise<MensagemPet[]>;
  enviar(conversa: string, id: string, conteudo: string): Promise<void>;
  ler(conversa: string, ate: string): Promise<void>;
  observar(atualizar: () => void): () => void;
}

// Lê em páginas para incluir também históricos que ultrapassam o limite da Data API.
async function lerPaginas<T extends { id: string }>(consultar: (inicio: number, fim: number) => PromiseLike<{
  data: T[] | null; error: unknown;
}>): Promise<T[]> {
  const linhas = new Map<string, T>();
  const tamanho = 200;
  for (let inicio = 0; ; inicio += tamanho) {
    const { data, error } = await consultar(inicio, inicio + tamanho - 1);
    if (error || !data) throw error ?? new Error("Resposta incompleta.");
    for (const linha of data) linhas.set(linha.id, linha);
    if (data.length < tamanho) return Array.from(linhas.values());
  }
}

export async function abrirConversaPet(pet: string): Promise<string> {
  const { data, error } = await createClient().rpc("abrir_conversa_pet", { animal_id: pet });
  if (error || !data) throw new Error("Não foi possível abrir a conversa sobre este animal.");
  return data;
}

export function obterCaixaPet(usuario: string): CaixaPet {
  const banco = createClient();
  return {
    listar: () => lerPaginas<ConversaPet>((inicio, fim) => banco.from("caixa_conversas_pet")
      .select("id,nome_pet,fotos,nome_responsavel,nome_interessado,ultima_mensagem,atividade_em,nao_lida")
      .order("atividade_em", { ascending: false }).order("id").range(inicio, fim)),
    historico: (conversa) => lerPaginas<MensagemPet>((inicio, fim) => banco.from("mensagens_pet")
      .select("id,remetente_id,conteudo,enviada_em,lida").eq("conversa_id", conversa)
      .order("enviada_em").order("id").range(inicio, fim)),
    async enviar(conversa, id, conteudo) {
      const { error } = await banco.from("mensagens_pet").insert({ id, conversa_id: conversa, conteudo });
      if (!error) return;
      // Uma resposta perdida pode deixar a mensagem gravada. Confirma o mesmo envio antes de tentar outra vez.
      if (error.code === "23505") {
        const anterior = await banco.from("mensagens_pet").select("conteudo").eq("id", id)
          .eq("conversa_id", conversa).eq("remetente_id", usuario).maybeSingle();
        if (anterior.data?.conteudo === conteudo) return;
      }
      throw error;
    },
    async ler(conversa, ate) {
      const { error } = await banco.from("mensagens_pet").update({ lida: true })
        .eq("conversa_id", conversa).neq("remetente_id", usuario).eq("lida", false).lte("enviada_em", ate);
      if (error) throw error;
      window.dispatchEvent(new Event("avisos-guardiao-atualizados"));
    },
    observar(atualizar) {
      const canal = banco.channel(`caixa-pet-${usuario}-${crypto.randomUUID()}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversas_pet" }, atualizar)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensagens_pet" }, atualizar)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "mensagens_pet" }, atualizar)
        .subscribe((estado) => { if (estado === "SUBSCRIBED") atualizar(); });
      return () => { void banco.removeChannel(canal); };
    },
  };
}
