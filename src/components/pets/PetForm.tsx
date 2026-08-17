"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pet } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";

interface PetFormProps {
  initialData?: Pet;
  isEditing?: boolean;
}

export function PetForm({ initialData, isEditing = false }: PetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados dos formulários (simulados)
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const handleAddFakeImage = () => {
    setImages([...images, "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop"]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simula salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/pets");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Animal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Fotos</Label>
              <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative h-24 w-24 rounded-md overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={handleAddFakeImage}
                  className="h-24 w-24 flex flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <ImagePlus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Adicionar</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={initialData?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Espécie</Label>
                <select id="species" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" defaultValue={initialData?.species || "Cachorro"}>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Porte</Label>
                <select id="size" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" defaultValue={initialData?.size || "Médio"}>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade Aproximada</Label>
                <Input id="age" placeholder="Ex: 2 anos, 3 meses..." defaultValue={initialData?.age} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexo</Label>
                <select id="gender" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" defaultValue={initialData?.gender || "Fêmea"}>
                  <option value="Fêmea">Fêmea</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input id="location" placeholder="Cidade, Estado" defaultValue={initialData?.location} required />
              </div>
            </div>

            <div className="flex gap-6 py-2 border-y">
              <div className="flex items-center space-x-2">
                <Checkbox id="vaccinated" defaultChecked={initialData?.vaccinated} />
                <Label htmlFor="vaccinated">Vacinado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="castrated" defaultChecked={initialData?.castrated} />
                <Label htmlFor="castrated">Castrado</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="history">História</Label>
              <Textarea 
                id="history" 
                placeholder="Conte a história de resgate deste animal..." 
                defaultValue={initialData?.history} 
                rows={4}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperament">Temperamento (separado por vírgula)</Label>
              <Input 
                id="temperament" 
                placeholder="Ex: Dócil, Brincalhão, Calmo..." 
                defaultValue={initialData?.temperament?.join(', ')} 
                required 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 bg-muted/20 py-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Pet"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
