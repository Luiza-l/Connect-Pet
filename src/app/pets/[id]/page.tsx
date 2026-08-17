import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockPets } from "@/data/pets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Info, ShieldCheck, Heart, ArrowLeft, HeartHandshake } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

interface PetDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function PetDetailsPage({ params }: PetDetailsProps) {
  const { id } = await params;
  const pet = mockPets.find(p => p.id === id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
      <Link href="/pets" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para todos os pets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            <Image
              src={pet.images[0] || "/placeholder.jpg"}
              alt={`Foto principal de ${pet.name}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          {pet.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pet.images.slice(1).map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                  <Image src={img} alt={`Foto secundária de ${pet.name}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Pet */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-foreground">{pet.name}</h1>
              <div className="flex items-center text-muted-foreground font-medium">
                <MapPin className="w-5 h-5 mr-1.5 text-primary" />
                <span>{pet.location}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20 shadow-sm">
              {pet.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">{pet.species}</Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">{pet.gender}</Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">{pet.size}</Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">{pet.age}</Badge>
          </div>

          <Card className="mb-10 border-transparent shadow-sm bg-muted/20">
            <CardContent className="p-8">
              <h3 className="font-bold text-xl flex items-center mb-4">
                <Info className="w-6 h-6 mr-2 text-primary" /> A História
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {pet.history}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-background shadow-sm hover:border-primary/30 transition-colors">
              <ShieldCheck className={`w-10 h-10 mb-3 ${pet.vaccinated ? 'text-primary' : 'text-muted-foreground/50'}`} />
              <span className="font-semibold text-base mb-1">Vacinado</span>
              <span className="text-sm text-muted-foreground">{pet.vaccinated ? 'Sim' : 'Não'}</span>
            </div>
            <div className="border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-background shadow-sm hover:border-primary/30 transition-colors">
              <Heart className={`w-10 h-10 mb-3 ${pet.castrated ? 'text-primary' : 'text-muted-foreground/50'}`} />
              <span className="font-semibold text-base mb-1">Castrado</span>
              <span className="text-sm text-muted-foreground">{pet.castrated ? 'Sim' : 'Não'}</span>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="font-bold mb-4 text-xl">Temperamento</h3>
            <div className="flex flex-wrap gap-3">
              {pet.temperament.map((t, i) => (
                <Badge key={i} variant="outline" className="bg-background px-4 py-1.5 text-sm">{t}</Badge>
              ))}
            </div>
          </div>

          {/* Fluxo de Interesse (Simulado via Dialog) */}
          <div className="mt-auto pt-8 border-t border-border/40">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg h-16 shadow-lg shadow-primary/20 rounded-2xl transition-all hover:scale-[1.02]" disabled={pet.status !== 'Disponível'}>
                  <HeartHandshake className="mr-3 h-6 w-6" />
                  Tenho interesse em adotar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Processo de Adoção Responsável</DialogTitle>
                  <DialogDescription className="pt-4 text-base">
                    {pet.isOng ? (
                      <span>
                        Atenção: Este pet está sob a responsabilidade de uma <strong>ONG</strong>. 
                        As informações preenchidas a seguir serão coletadas para avaliação. 
                        Posteriormente, a ONG fornecerá uma devolutiva sobre a adoção.
                      </span>
                    ) : (
                      <span>
                        Atenção: Este pet está sob a responsabilidade de um <strong>Tutor/Protetor Independente</strong>. 
                        Suas informações serão enviadas diretamente ao responsável atual do animal para avaliação.
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between mt-6">
                  <Button variant="ghost" className="w-full sm:w-auto">Cancelar</Button>
                  <Button asChild className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Link href={`/adocao/${pet.id}`}>Entendi, continuar</Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
