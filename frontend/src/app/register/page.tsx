'use client'

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const router = useRouter()


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        toast({
          title: "Cadastro realizado com sucesso!",
        });
        router.replace('/')
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: errorData.message || "Ocorreu um erro. Tente novamente.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Ocorreu um erro. Tente novamente.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <form onSubmit={handleRegister}>
          <CardHeader>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Informe seus dados para se cadastrar!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nome do usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="w-full flex flex-row items-center justify-between">
              <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href='/'>
                Já tem cadastro? clique aqui.
              </Link>
              <Button type="submit">Cadastrar</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
