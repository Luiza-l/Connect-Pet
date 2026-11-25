"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, ImagePlus, Loader2, Move, RefreshCw, UploadCloud, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  FotoPet,
  MAX_FOTOS_PET,
  TAMANHO_MAX_FOTO_BYTES,
  TIPOS_FOTO_ACEITOS,
  novoIdFoto,
  validarFotoPet
} from "@/lib/petPhotos";

interface PetPhotoUploaderProps {
  fotos: FotoPet[];
  onChange: React.Dispatch<React.SetStateAction<FotoPet[]>>;
  disabled?: boolean;
  maxFotos?: number;
}

function urlDaFoto(foto: FotoPet) {
  return foto.tipo === "remota" ? foto.url : foto.previewUrl;
}

export function PetPhotoUploader({ fotos, onChange, disabled = false, maxFotos = MAX_FOTOS_PET }: PetPhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const substituirRef = useRef<HTMLInputElement>(null);
  const fotosRef = useRef(fotos);
  const [idParaSubstituir, setIdParaSubstituir] = useState<string | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const [arrastando, setArrastando] = useState(false);
  const [filaEdicao, setFilaEdicao] = useState<File[]>([]);
  const [idEmSubstituicao, setIdEmSubstituicao] = useState<string | null>(null);
  const [imagemCarregada, setImagemCarregada] = useState<{ arquivo: File; imagem: HTMLImageElement } | null>(null);
  const arquivoEmEdicao = filaEdicao[0] || null;
  const imagemEdicao = imagemCarregada?.arquivo === arquivoEmEdicao ? imagemCarregada.imagem : null;
  const [zoom, setZoom] = useState(1);
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);
  const telaEdicaoRef = useRef<HTMLCanvasElement>(null);
  const telasPreviasRef = useRef<Array<HTMLCanvasElement | null>>([]);
  const arrastoRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  useEffect(() => {
    if (!arquivoEmEdicao) {
      return;
    }

    const url = URL.createObjectURL(arquivoEmEdicao);
    const imagem = new window.Image();
    imagem.onload = () => setImagemCarregada({ arquivo: arquivoEmEdicao, imagem });
    imagem.onerror = () => setErroEdicao("Não foi possível abrir esta imagem. Escolha outro arquivo.");
    imagem.src = url;

    return () => URL.revokeObjectURL(url);
  }, [arquivoEmEdicao]);

  useEffect(() => {
    const telas = [telaEdicaoRef.current, ...telasPreviasRef.current].filter((tela): tela is HTMLCanvasElement => !!tela);
    if (!imagemEdicao) return;

    telas.forEach((tela) => {
      const contexto = tela.getContext("2d");
      if (!contexto) return;

      const largura = tela.width;
      const altura = tela.height;
      const escala = Math.max(largura / imagemEdicao.naturalWidth, altura / imagemEdicao.naturalHeight) * zoom;
      const larguraImagem = imagemEdicao.naturalWidth * escala;
      const alturaImagem = imagemEdicao.naturalHeight * escala;
      const x = -(larguraImagem - largura) * (posicao.x + 1) / 2;
      const y = -(alturaImagem - altura) * (posicao.y + 1) / 2;

      contexto.clearRect(0, 0, largura, altura);
      contexto.fillStyle = "#ffffff";
      contexto.fillRect(0, 0, largura, altura);
      contexto.drawImage(imagemEdicao, x, y, larguraImagem, alturaImagem);
    });
  }, [imagemEdicao, posicao, zoom]);

  useEffect(() => {
    fotosRef.current = fotos;
  }, [fotos]);

  // Libera as URLs temporárias de pré-visualização ao sair da tela.
  useEffect(() => {
    return () => {
      fotosRef.current.forEach((f) => {
        if (f.tipo === "local") URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const criarFotoLocal = (arquivo: File): FotoPet => ({
    id: novoIdFoto(),
    tipo: "local",
    arquivo,
    previewUrl: URL.createObjectURL(arquivo),
    status: "pendente"
  });

  const adicionarArquivos = useCallback(
    async (lista: FileList | File[]) => {
      const arquivos = Array.from(lista);
      if (arquivos.length === 0) return;

      const mensagens: string[] = [];
      const vagas = maxFotos - fotosRef.current.length;
      if (vagas <= 0) {
        setErros([`Limite de ${maxFotos} fotos atingido. Remova uma foto para adicionar outra.`]);
        return;
      }

      const validos: File[] = [];
      for (const arquivo of arquivos) {
        const erro = await validarFotoPet(arquivo);
        if (erro) mensagens.push(erro);
        else validos.push(arquivo);
      }

      const aceitos = validos.slice(0, vagas);
      if (validos.length > vagas) {
        mensagens.push(`Limite de ${maxFotos} fotos: ${validos.length - vagas} arquivo(s) não foram adicionados.`);
      }

      if (aceitos.length > 0) {
        setZoom(1);
        setPosicao({ x: 0, y: 0 });
        setErroEdicao(null);
        setFilaEdicao(aceitos);
      }
      setErros(mensagens);
    },
    [maxFotos]
  );

  const substituirArquivo = useCallback(
    async (id: string, arquivo: File) => {
      const erro = await validarFotoPet(arquivo);
      if (erro) {
        setErros([erro]);
        return;
      }
      setIdEmSubstituicao(id);
      setZoom(1);
      setPosicao({ x: 0, y: 0 });
      setErroEdicao(null);
      setFilaEdicao([arquivo]);
      setErros([]);
    },
    []
  );

  const remover = (id: string) => {
    onChange((anteriores) => {
      const alvo = anteriores.find((f) => f.id === id);
      if (alvo?.tipo === "local") URL.revokeObjectURL(alvo.previewUrl);
      return anteriores.filter((f) => f.id !== id);
    });
    setErros([]);
  };

  const aoSoltar = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastando(false);
    if (disabled) return;
    void adicionarArquivos(e.dataTransfer.files);
  };

  const cheio = fotos.length >= maxFotos;
  const limiteMb = TAMANHO_MAX_FOTO_BYTES / 1024 / 1024;
  const accept = TIPOS_FOTO_ACEITOS.join(",");

  const confirmarEdicao = async () => {
    const imagem = imagemEdicao;
    const arquivoOriginal = arquivoEmEdicao;
    if (!imagem || !arquivoOriginal) return;

    const larguraQuadro = 480;
    const alturaQuadro = 360;
    const escala = Math.max(larguraQuadro / imagem.naturalWidth, alturaQuadro / imagem.naturalHeight) * zoom;
    const larguraImagem = imagem.naturalWidth * escala;
    const alturaImagem = imagem.naturalHeight * escala;
    const deslocamentoX = -(larguraImagem - larguraQuadro) * (posicao.x + 1) / 2;
    const deslocamentoY = -(alturaImagem - alturaQuadro) * (posicao.y + 1) / 2;
    const larguraRecorte = larguraQuadro / escala;
    const alturaRecorte = alturaQuadro / escala;
    const ladoSaida = Math.max(1, Math.min(1600, Math.round(larguraRecorte)));
    const tela = document.createElement("canvas");
    tela.width = ladoSaida;
    tela.height = Math.round(ladoSaida * 3 / 4);
    const contexto = tela.getContext("2d");

    if (!contexto) {
      setErroEdicao("Não foi possível preparar a imagem. Tente novamente.");
      return;
    }

    contexto.imageSmoothingEnabled = true;
    contexto.imageSmoothingQuality = "high";
    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, tela.width, tela.height);
    contexto.drawImage(
      imagem,
      -deslocamentoX / escala,
      -deslocamentoY / escala,
      larguraRecorte,
      alturaRecorte,
      0,
      0,
      tela.width,
      tela.height
    );

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        tela.toBlob((resultado) => resultado ? resolve(resultado) : reject(new Error("Não foi possível gerar a imagem editada.")), "image/jpeg", 0.92);
      });
      const arquivoEditado = new File([blob], `pet-editado-${Date.now()}.jpg`, { type: "image/jpeg" });
      const novaFoto = criarFotoLocal(arquivoEditado);

      if (idEmSubstituicao) {
        onChange((anteriores) => anteriores.map((foto) => {
          if (foto.id !== idEmSubstituicao) return foto;
          if (foto.tipo === "local") URL.revokeObjectURL(foto.previewUrl);
          return novaFoto;
        }));
        setIdEmSubstituicao(null);
      } else {
        onChange((anteriores) => [...anteriores, novaFoto].slice(0, maxFotos));
      }

      setZoom(1);
      setPosicao({ x: 0, y: 0 });
      setFilaEdicao((anteriores) => anteriores.slice(1));
      setErroEdicao(null);
    } catch (erro) {
      setErroEdicao(erro instanceof Error ? erro.message : "Não foi possível gerar a imagem editada.");
    }
  };

  const cancelarEdicao = () => {
    setFilaEdicao([]);
    setIdEmSubstituicao(null);
    setErroEdicao(null);
  };

  const moverImagem = (evento: React.PointerEvent<HTMLDivElement>) => {
    const inicio = arrastoRef.current;
    const imagem = imagemEdicao;
    const tela = telaEdicaoRef.current;
    if (!inicio || !imagem || !tela) return;

    const escala = Math.max(tela.width / imagem.naturalWidth, tela.height / imagem.naturalHeight) * zoom;
    const sobraX = Math.max(1, imagem.naturalWidth * escala - tela.width);
    const sobraY = Math.max(1, imagem.naturalHeight * escala - tela.height);
    setPosicao({
      x: Math.max(-1, Math.min(1, inicio.posX - (evento.clientX - inicio.x) * 2 / sobraX)),
      y: Math.max(-1, Math.min(1, inicio.posY - (evento.clientY - inicio.y) * 2 / sobraY))
    });
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id="pet-photo-input"
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) void adicionarArquivos(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={substituirRef}
        id="pet-photo-replace-input"
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={(e) => {
          const arquivo = e.target.files?.[0];
          if (arquivo && idParaSubstituir) void substituirArquivo(idParaSubstituir, arquivo);
          setIdParaSubstituir(null);
          e.target.value = "";
        }}
      />

      {!cheio && (
        <button
          type="button"
          id="pet-photo-dropzone"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={aoSoltar}
          className={`group w-full min-h-[44px] rounded-2xl border-2 border-dashed p-5 sm:p-6 flex flex-col items-center justify-center gap-2 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed ${
            arrastando
              ? "border-primary bg-primary/10"
              : "border-border bg-secondary/30 hover:border-primary/60 hover:bg-primary/5"
          }`}
        >
          <span className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <UploadCloud className="w-5 h-5" />
          </span>
          <span className="text-sm font-semibold text-foreground">
            Toque para escolher fotos ou arraste aqui
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG ou WebP · até {limiteMb} MB cada · {fotos.length}/{maxFotos} fotos
          </span>
        </button>
      )}

      {erros.length > 0 && (
        <div
          role="alert"
          className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <ul className="space-y-0.5 min-w-0 break-words">
            {erros.map((erro, i) => (
              <li key={i}>{erro}</li>
            ))}
          </ul>
        </div>
      )}

      {fotos.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fotos.map((foto, indice) => (
            <li
              key={foto.id}
              className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-secondary shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlDaFoto(foto)}
                alt={`Foto ${indice + 1} do animal`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {indice === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground shadow">
                  Principal
                </span>
              )}
              {foto.tipo === "local" && foto.status !== "erro" && (
                <span className="absolute left-2 bottom-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
                  {foto.status === "enviando" ? "Enviando..." : "Novo"}
                </span>
              )}

              {foto.tipo === "local" && foto.status === "enviando" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="w-7 h-7 animate-spin text-white" />
                </div>
              )}
              {foto.tipo === "local" && foto.status === "erro" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-rose-950/70 p-2 text-center text-white">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-xs leading-tight line-clamp-4">
                    {foto.mensagemErro || "Falha no envio"}
                  </span>
                </div>
              )}

              {!disabled && (
                <>
                  <button
                    type="button"
                    onClick={() => remover(foto.id)}
                    aria-label={`Remover foto ${indice + 1}`}
                    className="absolute right-0 top-0 flex min-h-[44px] min-w-[44px] items-center justify-center"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-rose-600">
                      <X className="w-4 h-4" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdParaSubstituir(foto.id);
                      substituirRef.current?.click();
                    }}
                    aria-label={`Substituir foto ${indice + 1}`}
                    className="absolute right-0 bottom-0 flex min-h-[44px] min-w-[44px] items-center justify-center"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-primary">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {fotos.length === 0 && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ImagePlus className="w-3.5 h-3.5" /> A primeira foto será a imagem principal nos cards e no catálogo.
        </p>
      )}

      {arquivoEmEdicao && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-6" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="editar-foto-titulo"
            className="my-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="editar-foto-titulo" className="text-lg font-bold sm:text-xl">Ajuste a foto do pet</h2>
                <p className="mt-1 text-sm text-muted-foreground">Arraste para enquadrar e use o controle para aproximar ou afastar.</p>
              </div>
              <button type="button" onClick={cancelarEdicao} aria-label="Cancelar edição da foto" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <div className="relative mx-auto w-full max-w-xl touch-none overflow-hidden rounded-2xl bg-muted" onPointerMove={(evento) => { if (arrastoRef.current) moverImagem(evento); }} onPointerUp={() => { arrastoRef.current = null; }} onPointerCancel={() => { arrastoRef.current = null; }}>
                  <canvas
                    ref={telaEdicaoRef}
                    width={480}
                    height={360}
                    aria-label="Pré-visualização do recorte. Arraste a imagem para ajustar o enquadramento."
                    className="block aspect-[4/3] w-full cursor-move"
                    onPointerDown={(evento) => {
                      evento.currentTarget.setPointerCapture(evento.pointerId);
                      arrastoRef.current = { x: evento.clientX, y: evento.clientY, posX: posicao.x, posY: posicao.y };
                    }}
                  />
                  {!imagemEdicao && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
                  <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-xs font-medium text-white"><Move className="h-3.5 w-3.5" /> Mova para ajustar</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <ZoomOut className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input aria-label="Aproximar ou afastar a foto" type="range" min="1" max="3" step="0.01" value={zoom} onChange={(evento) => setZoom(Number(evento.target.value))} className="w-full accent-primary" />
                  <ZoomIn className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="w-12 text-right text-sm tabular-nums text-muted-foreground">{zoom.toFixed(1)}×</span>
                </div>
              </div>

              <div className="min-w-0 space-y-3">
                <p className="text-sm font-semibold">Prévia de divulgação e perfil</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-background p-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <canvas ref={(tela) => { telasPreviasRef.current[0] = tela; }} width={240} height={180} aria-label="Prévia da foto no card de divulgação" className="block h-full w-full object-cover" />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">Card do pet</p>
                  </div>
                  <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-background p-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <canvas ref={(tela) => { telasPreviasRef.current[1] = tela; }} width={240} height={180} aria-label="Prévia da foto no perfil do pet" className="block h-full w-full object-cover" />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">Perfil do pet</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">A foto final será salva no formato 4:3 para combinar com os cards e a página de detalhes.</p>
              </div>
            </div>

            {erroEdicao && <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{erroEdicao}</p>}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={cancelarEdicao} className="min-h-[44px] rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancelar e escolher outra foto</button>
              <button type="button" disabled={!imagemEdicao} onClick={() => void confirmarEdicao()} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                <Check className="h-4 w-4" /> Confirmar foto
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
