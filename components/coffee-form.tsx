"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Coffee } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCoffee, updateCoffee } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface CoffeeFormProps {
  coffee?: Coffee
}

export function CoffeeForm({ coffee }: CoffeeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name"),
      sensoryProfile: formData.get("sensoryProfile"),
      region: formData.get("region"),
      producer: formData.get("producer"),
      variety: formData.get("variety"),
      process: formData.get("process"),
      altitude: formData.get("altitude"),
    }

    try {
      const response = await fetch(coffee ? `/api/coffees/${coffee.id}` : "/api/coffees", {
        method: coffee ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar café")
      }

      const result = await response.json()
      router.push("/coffees")
      router.refresh()
      toast.success("Café salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar café:", error)
      toast.error("Erro ao salvar café. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                name="name"
                placeholder="Nome do café"
                defaultValue={coffee?.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensoryProfile">Perfil sensorial</Label>
              <Input
                type="text"
                name="sensoryProfile"
                placeholder="Ex: Chocolate, caramelo, frutas vermelhas"
                defaultValue={coffee?.sensoryProfile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Região</Label>
              <Input
                type="text"
                name="region"
                placeholder="Ex: Mantiqueira de Minas"
                defaultValue={coffee?.region}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="producer">Produtor</Label>
              <Input
                type="text"
                name="producer"
                placeholder="Nome do produtor"
                defaultValue={coffee?.producer}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variety">Variedade</Label>
              <Input
                type="text"
                name="variety"
                placeholder="Ex: Catuaí Vermelho"
                defaultValue={coffee?.variety}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="process">Processo</Label>
              <Input
                type="text"
                name="process"
                placeholder="Ex: Natural"
                defaultValue={coffee?.process}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altitude">Altitude</Label>
              <Input
                type="text"
                name="altitude"
                placeholder="Ex: 1200m"
                defaultValue={coffee?.altitude}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/coffees">  
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : coffee ? "Salvar alterações" : "Adicionar café"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

