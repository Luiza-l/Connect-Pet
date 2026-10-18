"use client";

import React, { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  encontrarMunicipioOficial,
  obterEstadosIbge,
  obterMunicipiosIbge,
  type EstadoIbge,
  type MunicipioIbge,
} from "@/lib/localidadesIbge";

interface SeletorLocalidadeProps {
  idBase: string;
  estado: string;
  cidade: string;
  aoAlterarEstado: (estado: string) => void;
  aoAlterarCidade: (cidade: string) => void;
  rotuloCidade?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
}

export function SeletorLocalidade({
  idBase,
  estado,
  cidade,
  aoAlterarEstado,
  aoAlterarCidade,
  rotuloCidade = "Município",
  obrigatorio = true,
  desabilitado = false,
}: SeletorLocalidadeProps) {
  const [estados, setEstados] = useState<EstadoIbge[]>([]);
  const [municipios, setMunicipios] = useState<MunicipioIbge[]>([]);
  const [ufMunicipiosCarregados, setUfMunicipiosCarregados] = useState("");
  const [carregandoEstados, setCarregandoEstados] = useState(true);
  const [erroEstados, setErroEstados] = useState<string | null>(null);
  const [erroMunicipios, setErroMunicipios] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    obterEstadosIbge()
      .then((itens) => {
        if (ativo) {
          setEstados(itens);
          setErroEstados(null);
        }
      })
      .catch(() => {
        if (ativo) setErroEstados("Não foi possível carregar os estados pelo IBGE.");
      })
      .finally(() => {
        if (ativo) setCarregandoEstados(false);
      });
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  useEffect(() => {
    let ativo = true;
    if (!estado) return;

    obterMunicipiosIbge(estado)
      .then((itens) => {
        if (ativo) {
          setMunicipios(itens);
          setUfMunicipiosCarregados(estado);
          setErroMunicipios(null);
        }
      })
      .catch(() => {
        if (ativo) {
          setMunicipios([]);
          setUfMunicipiosCarregados(estado);
          setErroMunicipios("Não foi possível carregar os municípios deste estado pelo IBGE.");
        }
      });
    return () => {
      ativo = false;
    };
  }, [estado, tentativa]);

  const municipiosVisiveis = ufMunicipiosCarregados === estado ? municipios : [];
  const carregandoMunicipios = Boolean(estado) && ufMunicipiosCarregados !== estado;
  const cidadeReconhecida = Boolean(encontrarMunicipioOficial(cidade, municipiosVisiveis));
  const carregando = carregandoEstados || carregandoMunicipios;
  const erro = erroMunicipios || erroEstados;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <label htmlFor={`${idBase}-estado`} className="text-xs font-bold text-foreground">
          Estado (UF) {obrigatorio ? "*" : ""}
        </label>
        <select
          id={`${idBase}-estado`}
          value={estado}
          required={obrigatorio}
          disabled={desabilitado || carregandoEstados}
          onChange={(evento) => {
            aoAlterarEstado(evento.target.value);
            aoAlterarCidade("");
          }}
          className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary disabled:cursor-wait disabled:opacity-70"
        >
          <option value="">{carregandoEstados ? "Carregando estados..." : "Selecione o estado"}</option>
          {estados.map((item) => (
            <option key={item.id} value={item.sigla}>{item.nome} ({item.sigla})</option>
          ))}
        </select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <label htmlFor={`${idBase}-cidade`} className="text-xs font-bold text-foreground">
          {rotuloCidade} {obrigatorio ? "*" : ""}
        </label>
        <select
          id={`${idBase}-cidade`}
          value={cidade}
          required={obrigatorio}
          disabled={desabilitado || !estado || carregandoMunicipios || Boolean(erro)}
          aria-describedby={`${idBase}-ajuda`}
          onChange={(evento) => aoAlterarCidade(evento.target.value)}
          className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          <option value="">
            {!estado ? "Selecione primeiro o estado" : carregandoMunicipios ? "Carregando municípios..." : "Selecione o município"}
          </option>
          {cidade && !cidadeReconhecida && (
            <option value={cidade} disabled>{cidade} — selecione novamente</option>
          )}
          {municipiosVisiveis.map((municipio) => (
            <option key={municipio.id} value={municipio.nome}>{municipio.nome}</option>
          ))}
        </select>
        <p id={`${idBase}-ajuda`} className="text-xs text-muted-foreground">
          Municípios oficiais do IBGE, filtrados pelo estado selecionado.
        </p>
      </div>

      {carregando && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-3" role="status">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Consultando localidades oficiais...
        </p>
      )}

      {erro && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 sm:col-span-3 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="text-xs text-destructive">{erro}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setErroEstados(null);
              setErroMunicipios(null);
              setCarregandoEstados(estados.length === 0);
              setUfMunicipiosCarregados("");
              setTentativa((valor) => valor + 1);
            }}
            className="min-h-[44px] w-full shrink-0 sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
          </Button>
        </div>
      )}
    </div>
  );
}
