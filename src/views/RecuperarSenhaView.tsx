"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";
import { ROTA_REDEFINICAO } from "@/lib/recuperacaoSenha";
import { isValidEmail } from "@/lib/validation";
import { obterMensagemErro, registrarErroSeguro } from "@/lib/mensagensErro";

export function RecuperarSenhaView() {
  const [email, setEmail] = useState("");
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);
  const [segundosEspera, setSegundosEspera] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const envioEmAndamento = useRef(false);

  useEffect(() => {
    if (segundosEspera <= 0) return;
    const temporizador = window.setTimeout(() => setSegundosEspera((segundos) => Math.max(0, segundos - 1)), 1000);
    return () => window.clearTimeout(temporizador);
  }, [segundosEspera]);

  const enviarSolicitacao = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (envioEmAndamento.current || solicitacaoEnviada || segundosEspera > 0) return;

    const emailNormalizado = email.trim();
    if (!isValidEmail(emailNormalizado)) {
      setErro("Informe um endereço de e-mail válido.");
      return;
    }

    envioEmAndamento.current = true;
    setEstaEnviando(true);
    setErro(null);

    try {
      const supabase = createClient();
      const origemPublica = process.env.NEXT_PUBLIC_SITE_URL?.trim() || window.location.origin;
      const enderecoRedefinicao = new URL(ROTA_REDEFINICAO, origemPublica).href;
      const { error: erroEnvio } = await supabase.auth.resetPasswordForEmail(emailNormalizado, {
        redirectTo: enderecoRedefinicao,
      });

      if (erroEnvio) {
        registrarErroSeguro("Falha ao solicitar recuperação de senha", erroEnvio);
        setErro(obterMensagemErro(erroEnvio, "recuperacao"));
        setSegundosEspera(60);
        return;
      }

      setSolicitacaoEnviada(true);
    } catch (falha) {
      registrarErroSeguro("Falha inesperada ao solicitar recuperação de senha", falha);
      setErro(obterMensagemErro(falha, "recuperacao"));
      setSegundosEspera(60);
    } finally {
      envioEmAndamento.current = false;
      setEstaEnviando(false);
    }
  };

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-primary/[0.04] to-background px-4 py-10 sm:py-16">
      <section className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card p-5 shadow-lg animate-in fade-in sm:p-8" aria-labelledby="titulo-recuperacao">
        <div className="space-y-2 text-center">
          <Link href="/" aria-label="ConnectPet — página inicial" className="relative mx-auto mb-2 block h-16 w-16 overflow-hidden rounded-full shadow-md shadow-primary/20 transition-transform hover:scale-105 sm:h-20 sm:w-20">
            <Image src="/images/logo-connectpet-redondo.png" alt="" fill sizes="80px" priority className="object-contain" />
          </Link>
          <h1 id="titulo-recuperacao" className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Recuperar acesso
          </h1>
          <p className="text-sm text-muted-foreground">
            Informe o e-mail cadastrado para receber as instruções de redefinição.
          </p>
        </div>

        {solicitacaoEnviada ? (
          <div role="status" className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
            Caso exista uma conta vinculada a esse e-mail, enviaremos as instruções para redefinir sua senha.
          </div>
        ) : (
          <form onSubmit={enviarSolicitacao} className="space-y-4">
            {erro && <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-400">{erro}</div>}
            <div className="space-y-1.5">
              <label htmlFor="email-recuperacao" className="font-bold text-foreground">E-mail cadastrado</label>
              <div className="relative">
                <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email-recuperacao"
                  type="email"
                  required
                  maxLength={100}
                  autoComplete="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="min-h-[44px] w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <Button type="submit" disabled={estaEnviando || segundosEspera > 0} className="h-12 w-full rounded-full bg-primary text-xs font-bold shadow-md transition-opacity hover:bg-primary/90 disabled:opacity-60">
              {estaEnviando ? "Enviando..." : segundosEspera > 0 ? `Aguarde ${segundosEspera}s` : "Enviar instruções"}
              <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
            </Button>
          </form>
        )}

        <Link href="/login" className="mx-auto inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Voltar ao login
        </Link>
      </section>
    </main>
  );
}
