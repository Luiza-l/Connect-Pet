import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Heart, Activity } from "lucide-react";
import { mockPets } from "@/data/pets";

export default function DashboardPage() {
  const myPets = mockPets.filter(p => p.isOng); // Simulando pets de um usuário específico
  const availablePets = myPets.filter(p => p.status === "Disponível").length;
  const inProcess = myPets.filter(p => p.status === "Em processo").length;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          Acompanhe o status dos seus pets e os interesses de adoção.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pets Cadastrados</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myPets.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de animais sob sua tutela
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis para Adoção</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePets}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando um novo lar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interesses Pendentes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProcess * 3 + 2}</div>
            <p className="text-xs text-muted-foreground">
              Formulários aguardando sua avaliação
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Cadastrar novo pet</p>
                <p className="text-sm text-muted-foreground">Adicione um novo animal ao catálogo</p>
              </div>
              <a href="/dashboard/pets/novo" className="text-sm font-semibold text-primary">Ir &rarr;</a>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Gerenciar pets</p>
                <p className="text-sm text-muted-foreground">Atualize status e informações</p>
              </div>
              <a href="/dashboard/pets" className="text-sm font-semibold text-primary">Ir &rarr;</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
