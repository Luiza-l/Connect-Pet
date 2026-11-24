import { MensagensReais } from "@/components/mensagens/MensagensReais";

export default async function PaginaMensagens({ searchParams }: PageProps<"/mensagens">) {
  const { pet, conversa } = await searchParams;
  return <div className="mx-auto w-full max-w-6xl space-y-5 px-3 py-6 sm:px-6 lg:py-10">
    <h1 className="font-serif text-3xl font-bold">Mensagens</h1>
    <MensagensReais key={typeof pet === "string" ? pet : "caixa"} pet={typeof pet === "string" ? pet : undefined}
      inicial={typeof conversa === "string" ? conversa : undefined} />
  </div>;
}
