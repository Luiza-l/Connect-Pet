"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Search, HandHeart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-2xl shadow-xl border-border">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Heart className="h-6 w-6 text-primary fill-current" />
          </div>
          <CardTitle className="text-3xl font-bold">Crie sua conta</CardTitle>
          <CardDescription className="text-base mt-2">
            Como você deseja utilizar a plataforma PetsAdot?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 p-6 pt-0">
          <Card className="relative overflow-hidden cursor-pointer hover:border-primary hover:shadow-md transition-all group" onClick={() => router.push("/pets")}>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Search className="h-8 w-8 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-bold text-xl mb-2">Quero Adotar</h3>
              <p className="text-sm text-muted-foreground">
                Estou procurando um novo membro para minha família.
              </p>
              <Button className="mt-6 w-full group-hover:bg-primary" variant="outline">
                Encontrar Pet
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden cursor-pointer hover:border-primary hover:shadow-md transition-all group" onClick={() => router.push("/login")}>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <HandHeart className="h-8 w-8 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-bold text-xl mb-2">Disponibilizar Pet</h3>
              <p className="text-sm text-muted-foreground">
                Sou protetor, ONG ou tutor e quero doar um animal.
              </p>
              <Button className="mt-6 w-full group-hover:bg-primary" variant="outline">
                Criar Perfil
              </Button>
            </CardContent>
          </Card>
        </CardContent>
        <div className="text-center p-6 pt-0 text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Faça login
          </Link>
        </div>
      </Card>
    </div>
  );
}
