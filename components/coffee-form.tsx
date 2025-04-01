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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: coffee?.name || "",
    sensoryProfile: coffee?.sensoryProfile || "",
    region: coffee?.region || "",
    producer: coffee?.producer || "",
    variety: coffee?.variety || "",
    process: coffee?.process || "",
    altitude: coffee?.altitude || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Enviando dados do café:", formData)

      if (coffee) {
        await updateCoffee(coffee.id, formData)
        toast({
          title: "Café atualizado",
          description: "O café foi atualizado com sucesso.",
        })
      } else {
        await createCoffee(formData)
        toast({
          title: "Café adicionado",
          description: "O café foi adicionado com sucesso.",
        })
      }

      router.push("/coffees")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar café:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o café. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Café</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="sensoryProfile">Perfil Sensorial</Label>
              <Textarea
                id="sensoryProfile"
                name="sensoryProfile"
                placeholder="Descreva as notas de sabor (ex: Cítrico, Chocolate, Floral)"
                value={formData.sensoryProfile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Região</Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="País ou região específica"
                  value={formData.region}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="producer">Produtor</Label>
                <Input
                  id="producer"
                  name="producer"
                  placeholder="Nome da fazenda ou cooperativa"
                  value={formData.producer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="variety">Variedade</Label>
                <Input
                  id="variety"
                  name="variety"
                  placeholder="Ex: Bourbon, Typica, Gesha"
                  value={formData.variety}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="process">Processo</Label>
                <Input
                  id="process"
                  name="process"
                  placeholder="Ex: Lavado, Natural, Honey"
                  value={formData.process}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="altitude">Altitude</Label>
              <Input
                id="altitude"
                name="altitude"
                placeholder="Ex: 1200-1500m"
                value={formData.altitude}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/coffees">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : coffee ? "Atualizar Café" : "Adicionar Café"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

