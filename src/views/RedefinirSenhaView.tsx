"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { criarClienteRecuperacao } from "@/lib/client";
import { obterMensagemErro, registrarErroSeguro } from "@/lib/mensagensErro";

type EstadoLink = "validando" | "valido" | "invalido" | "concluido";

export function RedefinirSenhaView() {
  const [estadoLink, setEstadoLink] = useState<EstadoLink>("validando");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [estaSalvando, setEstaSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const atualizacaoEmAndamento = useRef(false);
  const clienteRecuperacao = useRef<ReturnType<typeof criarClienteRecuperacao> | null>(null);
  const expiraEm = useRef(0);

  useEffect(() => {
    let componenteAtivo = true;
    let temporizador: number;
    const validarRetorno = async () => {
      if (!componenteAtivo) return;
      const cliente = criarClienteRecuperacao();
      clienteRecuperacao.current = cliente;
      const { error } = await cliente.auth.initialize();
      if (!componenteAtivo) return;
      if (error) throw error;
      const { data: { session } } = await cliente.auth.getSession();
      if (!componenteAtivo) return;
      expiraEm.current = (session?.expires_at ?? 0) * 1000;
      const restante = expiraEm.current - Date.now();
      if (!session || restante <= 0) {
        setEstadoLink("invalido");
        return;
      }
      setEstadoLink("valido");
      temporizador = window.setTimeout(() => setEstadoLink((estado) => estado === "valido" ? "invalido" : estado), restante);
    };
    void Promise.resolve().then(validarRetorno).catch(() => {
      if (componenteAtivo) setEstadoLink("invalido");
    });

    return () => {
      componenteAtivo = false;
      window.clearTimeout(temporizador);
      void clienteRecuperacao.current?.auth.dispose();
      clienteRecuperacao.current = null;
    };
  }, []);

  const atualizarSenha = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (estadoLink !== "valido" || atualizacaoEmAndamento.current) return;
    setErro(null);

    if (senha.length < 6 || senha.length > 64) {
      setErro("A senha deve conter entre 6 e 64 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As senhas informadas não são iguais.");
      return;
    }

    atualizacaoEmAndamento.current = true;
    setEstaSalvando(true);

    try {
      const supabase = clienteRecuperacao.current;
      if (!supabase || Date.now() >= expiraEm.current) {
        setEstadoLink("invalido");
        return;
      }
      const { error: erroAtualizacao } = await supabase.auth.updateUser({ password: senha });
      if (erroAtualizacao) {
        const erroAuth = erroAtualizacao as typeof erroAtualizacao & { code?: string; status?: number };
        if (erroAuth.status === 401 || erroAuth.status === 403 || erroAuth.code === "session_not_found") {
          setEstadoLink("invalido");
          return;
        }
        if (erroAuth.code === "weak_password") {
          setErro(obterMensagemErro(erroAtualizacao, "redefinicao"));
          return;
        }
        registrarErroSeguro("Falha ao redefinir senha", erroAtualizacao);
        setErro(obterMensagemErro(erroAtualizacao, "redefinicao"));
        return;
      }

      await supabase.auth.signOut({ scope: "local" });
      setEstadoLink("concluido");
      setSenha("");
      setConfirmacao("");
    } catch (falha) {
      registrarErroSeguro("Falha inesperada ao redefinir senha", falha);
      setErro(obterMensagemErro(falha, "redefinicao"));
    } finally {
      atualizacaoEmAndamento.current = false;
      setEstaSalvando(false);
    }
  };

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-primary/[0.04] to-background px-4 py-10 sm:py-16">
      <section className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card p-5 shadow-lg animate-in fade-in sm:p-8" aria-labelledby="titulo-redefinicao">
        <div className="space-y-2 text-center">
          <Link href="/" aria-label="ConnectPet — página inicial" className="relative mx-auto mb-2 block h-16 w-16 overflow-hidden rounded-full shadow-md shadow-primary/20 transition-transform hover:scale-105 sm:h-20 sm:w-20">
            <Image src="/images/logo-connectpet-redondo.png" alt="" fill sizes="80px" priority className="object-contain" />
          </Link>
          <h1 id="titulo-redefinicao" className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {estadoLink === "concluido" ? "Senha atualizada" : "Redefinir senha"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {estadoLink === "validando" && "Validando o link de recuperação..."}
            {estadoLink === "valido" && "Escolha uma nova senha para sua conta."}
            {estadoLink === "invalido" && "Este link é inválido, expirou ou já foi utilizado. Solicite um novo link para continuar."}
            {estadoLink === "concluido" && "Sua senha foi alterada com segurança. Agora você pode entrar na sua conta."}
          </p>
        </div>

        {estadoLink === "validando" && (
          <div role="status" className="rounded-2xl border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">Aguarde enquanto confirmamos sua sessão de recuperação.</div>
        )}

        {estadoLink === "valido" && (
          <form onSubmit={atualizarSenha} className="space-y-4">
            {erro && <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-400">{erro}</div>}
            <div className="space-y-1.5">
              <label htmlFor="nova-senha" className="font-bold text-foreground">Nova senha</label>
              <div className="relative">
                <Lock aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input id="nova-senha" type={mostrarSenha ? "text" : "password"} required minLength={6} maxLength={64} autoComplete="new-password" value={senha} onChange={(evento) => setSenha(evento.target.value)} placeholder="Mínimo de 6 caracteres" className="min-h-[44px] w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" aria-label={mostrarSenha ? "Ocultar nova senha" : "Mostrar nova senha"} aria-pressed={mostrarSenha} onClick={() => setMostrarSenha((visivel) => !visivel)} className="absolute right-1 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
                  {mostrarSenha ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Use entre 6 e 64 caracteres, como no cadastro.</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirmar-senha" className="font-bold text-foreground">Confirme a nova senha</label>
              <div className="relative">
                <Lock aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input id="confirmar-senha" type={mostrarConfirmacao ? "text" : "password"} required minLength={6} maxLength={64} autoComplete="new-password" value={confirmacao} onChange={(evento) => setConfirmacao(evento.target.value)} placeholder="Digite a senha novamente" className="min-h-[44px] w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" aria-label={mostrarConfirmacao ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"} aria-pressed={mostrarConfirmacao} onClick={() => setMostrarConfirmacao((visivel) => !visivel)} className="absolute right-1 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
                  {mostrarConfirmacao ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={estaSalvando} className="h-12 w-full rounded-full bg-primary text-xs font-bold shadow-md transition-opacity hover:bg-primary/90 disabled:opacity-60">
              {estaSalvando ? "Atualizando..." : "Salvar nova senha"}
            </Button>
          </form>
        )}

        {estadoLink === "invalido" && (
          <Link href="/recuperar-senha" className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary/90">
            Solicitar novo link
          </Link>
        )}
        {estadoLink === "concluido" && (
          <Link href="/login" className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary/90">
            Ir para o login
          </Link>
        )}
        {estadoLink !== "concluido" && (
          <Link href="/login" className="mx-auto inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Voltar ao login
          </Link>
        )}
      </section>
    </main>
  );
}
