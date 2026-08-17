"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { mockPets } from "@/data/pets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManagePetsPage() {
  const [pets, setPets] = useState(mockPets.filter(p => p.isOng));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      setPets(pets.filter(p => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Pets</h1>
          <p className="text-muted-foreground">Gerencie os animais que você disponibilizou para adoção.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pets/novo">
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Pet
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Pets</CardTitle>
          <CardDescription>Visualize, edite ou remova os animais do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Você ainda não tem nenhum pet cadastrado.</p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/pets/novo">Comece adicionando o primeiro</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Espécie/Porte</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pets.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell className="font-medium">{pet.name}</TableCell>
                      <TableCell>{pet.species} • {pet.size}</TableCell>
                      <TableCell>
                        <Badge variant={pet.status === 'Disponível' ? 'default' : 'secondary'}>
                          {pet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/pets/${pet.id}/editar`} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer"
                              onClick={() => setDeleteId(pet.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja remover este pet?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O pet não aparecerá mais como disponível na plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
