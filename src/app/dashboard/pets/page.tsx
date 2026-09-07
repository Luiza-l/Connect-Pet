"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ManagePetsPage() {
  const { pets, deletePet } = useApp();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deletePet(deleteId);
      setDeleteId(null);
    }
  };

  const statusLabel = {
    available: "Disponível",
    in_process: "Em Processo",
    adopted: "Adotado"
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
            <div className="rounded-2xl border border-border/60 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-secondary/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="p-3.5 pl-5 font-bold">Nome</th>
                    <th className="p-3.5 font-bold">Espécie / Porte</th>
                    <th className="p-3.5 font-bold">Status</th>
                    <th className="p-3.5 pr-5 text-right font-bold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {pets.map((pet) => (
                    <tr key={pet.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-foreground">{pet.name}</td>
                      <td className="p-3.5 text-muted-foreground">{pet.species === "dog" ? "Cachorro" : "Gato"} • {pet.size}</td>
                      <td className="p-3.5">
                        <Badge variant={pet.status === "available" ? "default" : "secondary"}>
                          {statusLabel[pet.status] || pet.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button variant="ghost" size="sm" asChild className="h-8 px-2.5 text-xs">
                            <Link href={`/dashboard/pets/${pet.id}/editar`}>
                              <Pencil className="mr-1 h-3.5 w-3.5" />
                              Editar
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => setDeleteId(pet.id)}
                          >
                            <Trash className="mr-1 h-3.5 w-3.5" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmação de Exclusão */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-foreground">Excluir este animal?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Essa ação não pode ser desfeita. O pet será removido permanentemente da base de dados.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
                Cancelar
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
