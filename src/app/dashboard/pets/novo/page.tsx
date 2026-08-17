import { PetForm } from "@/components/pets/PetForm";

export default function NovoPetPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Pet</h1>
        <p className="text-muted-foreground">Preencha as informações do animal para disponibilizá-lo para adoção.</p>
      </div>

      <PetForm />
    </div>
  );
}
