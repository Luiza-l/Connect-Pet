"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pet } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface PetFormProps {
  initialData?: Pet;
  isEditing?: boolean;
}

export function PetForm({ initialData, isEditing = false }: PetFormProps) {
  const router = useRouter();
  const { addPet, updatePet, currentUser } = useApp();

  const [name, setName] = useState(initialData?.name || "");
  const [species, setSpecies] = useState<"dog" | "cat">(initialData?.species || "dog");
  const [breed, setBreed] = useState(initialData?.breed || "Vira-lata (SRD)");
  const [size, setSize] = useState<"small" | "medium" | "large">(initialData?.size || "medium");
  const [approximateAge, setApproximateAge] = useState(initialData?.approximateAge || "1 ano");
  const [sex, setSex] = useState<"male" | "female">(initialData?.sex || "male");
  const [story, setStory] = useState(initialData?.story || "");
  const [headline, setHeadline] = useState(initialData?.headline || "");
  const [temperament, setTemperament] = useState(initialData?.temperament?.join(", ") || "Dócil, Brincalhão");
  const [vaccinated, setVaccinated] = useState(initialData ? initialData.vaccinated : true);
  const [castrated, setCastrated] = useState(initialData ? initialData.castrated : true);
  const [photos, setPhotos] = useState<string[]>(
    initialData?.photos || [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop"
    ]
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl("");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const temperamentArray = temperament.split(",").map((t) => t.trim()).filter(Boolean);

    if (isEditing && initialData) {
      updatePet(initialData.id, {
        name,
        species,
        breed,
        size,
        approximateAge,
        sex,
        story,
        headline,
        temperament: temperamentArray,
        vaccinated,
        castrated,
        photos: photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop"]
      });
    } else {
      addPet({
        name,
        species,
        breed,
        size,
        approximateAge,
        ageCategory: "young",
        sex,
        status: "available",
        vaccinated,
        castrated,
        dewormed: true,
        vaccinationDetails: "Vacinas essenciais em dia.",
        specialNeeds: "",
        photos: photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop"],
        headline: headline || "Pronto para alegrar seu lar.",
        story: story || "Resgatado com muito carinho, pronto para ser adotado com amor.",
        temperament: temperamentArray.length > 0 ? temperamentArray : ["Dócil"],
        temperamentDescription: "Amoroso e companheiro para todas as horas.",
        guardianId: currentUser?.id || "guardian-1",
        guardianName: currentUser?.name || "ONG / Protetor",
        guardianType: currentUser?.role === "guardian" ? currentUser.guardianType : "ngo",
        guardianPhone: currentUser?.primaryPhone || "(11) 97123-9988",
        guardianEmail: currentUser?.email || "contato@patinhascomamor.org.br",
        location: {
          city: currentUser?.role === "guardian" ? currentUser.city : "São Paulo",
          state: currentUser?.role === "guardian" ? currentUser.state : "SP",
          neighborhood: currentUser?.role === "guardian" ? currentUser.neighborhood : "Centro"
        }
      });
    }

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Animal" : "Informações do Animal"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Fotos */}
          <div className="space-y-2">
            <Label>Fotos do Animal</Label>
            <div className="flex flex-wrap gap-3">
              {photos.map((img, i) => (
                <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border">
                  <Image src={img} alt="Preview" fill sizes="80px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Cole o link da foto (URL)..."
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddPhoto}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Raça *</Label>
              <Input required value={breed} onChange={(e) => setBreed(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Espécie</Label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as "dog" | "cat")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="dog">Cão</option>
                <option value="cat">Gato</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Porte</Label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as "small" | "medium" | "large")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Sexo</Label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as "male" | "female")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="male">Macho</option>
                <option value="female">Fêmea</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Idade Aproximada</Label>
            <Input value={approximateAge} onChange={(e) => setApproximateAge(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Frase de Destaque</Label>
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>História de Resgate</Label>
            <Textarea rows={3} value={story} onChange={(e) => setStory(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Temperamento (separado por vírgula)</Label>
            <Input value={temperament} onChange={(e) => setTemperament(e.target.value)} />
          </div>

          <div className="flex gap-6 p-4 rounded-xl bg-secondary/50">
            <label htmlFor="vac" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                id="vac"
                type="checkbox"
                checked={vaccinated}
                onChange={(e) => setVaccinated(e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              Vacinado
            </label>
            <label htmlFor="cast" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                id="cast"
                type="checkbox"
                checked={castrated}
                onChange={(e) => setCastrated(e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              Castrado
            </label>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Salvar Alterações" : "Cadastrar Pet"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
