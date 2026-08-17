"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AdoptionFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [hasPets, setHasPets] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 4;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      handleNext();
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Interesse Registrado!</h1>
        <p className="text-muted-foreground text-lg max-w-lg mb-8">
          Seu formulário de pré-adoção foi enviado com sucesso. O responsável pelo pet avaliará suas informações e entrará em contato em breve.
        </p>
        <Button onClick={() => router.push("/pets")} size="lg">
          Voltar para o Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12 max-w-3xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Formulário de Pré-adoção</h1>
        <p className="text-muted-foreground">Etapa {step} de {totalSteps}</p>
        <div className="w-full bg-muted h-2 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }} 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg border-border">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Etapa 1: Dados do Imóvel</CardTitle>
                <CardDescription>Informações sobre o local onde o pet irá morar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Imóvel</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Selecione...</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="chacara">Chácara / Sítio</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Situação do Imóvel</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="proprio">Próprio</option>
                    <option value="alugado">Alugado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>O imóvel possui telas de proteção ou muros altos?</Label>
                  <Textarea placeholder="Descreva a segurança do local..." />
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Etapa 2: Família e Rotina</CardTitle>
                <CardDescription>Como será o dia a dia do pet na nova casa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantidade de Adultos</Label>
                    <Input type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantidade de Crianças</Label>
                    <Input type="number" min="0" defaultValue="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Todos na casa concordam com a adoção?</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="sim">Sim, todos concordam</option>
                    <option value="nao">Não, alguém discorda ou não sabe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Quanto tempo o pet ficará sozinho por dia?</Label>
                  <Input type="text" placeholder="Ex: 4 horas" />
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Etapa 3: Animais Atuais</CardTitle>
                <CardDescription>Nos conte sobre outros pets que você possui.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 border p-4 rounded-lg bg-muted/20">
                  <Checkbox 
                    id="hasPets" 
                    checked={hasPets}
                    onCheckedChange={(c) => setHasPets(c === true)}
                  />
                  <Label htmlFor="hasPets" className="font-medium cursor-pointer">
                    Atualmente eu já possuo outros animais de estimação
                  </Label>
                </div>

                {hasPets && (
                  <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-2">
                      <Label>Quantos e quais espécies?</Label>
                      <Input placeholder="Ex: 1 gato e 1 cachorro" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Eles são castrados e vacinados?</Label>
                      <Textarea placeholder="Detalhe a situação de saúde deles..." required />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 pt-4">
                  <Label>Você já teve outros pets no passado? Se sim, o que aconteceu com eles?</Label>
                  <Textarea placeholder="Conte brevemente seu histórico..." />
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Etapa 4: Custos e Compromisso</CardTitle>
                <CardDescription>Adoção responsável exige planejamento financeiro.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/10 text-primary-foreground rounded-lg">
                  <p className="text-sm text-foreground">
                    Ter um animal envolve custos contínuos com alimentação de qualidade, vacinas anuais, antipulgas, vermífugos e imprevistos veterinários.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="c1" required />
                    <Label htmlFor="c1" className="text-sm font-normal leading-snug">
                      Estou ciente dos custos envolvidos na manutenção da saúde e bem-estar do animal e possuo condições financeiras para assumi-los.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="c2" required />
                    <Label htmlFor="c2" className="text-sm font-normal leading-snug">
                      Estou ciente que animais vivem em média 10 a 15 anos e me comprometo a cuidar dele durante toda a sua vida.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="c3" required />
                    <Label htmlFor="c3" className="text-sm font-normal leading-snug">
                      Declaro que as informações prestadas neste formulário são verdadeiras.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrev} 
              disabled={step === 1}
            >
              Anterior
            </Button>
            <Button type="submit">
              {step === totalSteps ? "Enviar Formulário" : "Próxima Etapa"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
