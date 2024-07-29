'use client'

import { useState } from "react"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [email,setEmail] = useState<string>('')
  const [password,setPassword] = useState<string>('')

  const router = useRouter()

  async function handleSubmit() {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      return
    }
    if(result?.ok) {
      router.replace('/todos')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Entre com suas credenciais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}  required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="w-full flex flex-row items-center justify-between">
            <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href='/register'>
              Não tem login? clique aqui.
            </Link>
            <Button onClick={handleSubmit} type="submit">Entrar</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}