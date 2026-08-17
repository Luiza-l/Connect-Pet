import { notFound } from "next/navigation";
import { mockPets } from "@/data/pets";
import { PetForm } from "@/components/pets/PetForm";

interface EditPetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPetPage({ params }: EditPetPageProps) {
  const { id } = await params;
  const pet = mockPets.find(p => p.id === id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Pet</h1>
        <p className="text-muted-foreground">Atualize as informações de {pet.name}.</p>
      </div>

      <PetForm initialData={pet} isEditing />
    </div>
  );
}
