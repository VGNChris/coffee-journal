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
import { Rating } from "@/components/ui/rating"
import Link from "next/link"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const coffeeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sensoryProfile: z.string().min(1, "Perfil sensorial é obrigatório"),
  region: z.string().min(1, "Região é obrigatória"),
  producer: z.string().min(1, "Produtor é obrigatório"),
  variety: z.string().min(1, "Variedade é obrigatória"),
  process: z.string().min(1, "Processo é obrigatório"),
  altitude: z.string().min(1, "Altitude é obrigatória"),
  rating: z.number().min(0).max(5),
})

type CoffeeFormData = z.infer<typeof coffeeSchema>

interface CoffeeFormProps {
  coffee?: Coffee
  onSuccess?: (coffee: Coffee) => void
}

export function CoffeeForm({ coffee, onSuccess }: CoffeeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CoffeeFormData>({
    resolver: zodResolver(coffeeSchema),
    defaultValues: {
      name: coffee?.name || "",
      sensoryProfile: coffee?.sensoryProfile || "",
      region: coffee?.region || "",
      producer: coffee?.producer || "",
      variety: coffee?.variety || "",
      process: coffee?.process || "",
      altitude: coffee?.altitude || "",
      rating: coffee?.rating || 0,
    },
  })

  const rating = watch("rating")

  const onSubmit = async (data: CoffeeFormData) => {
    try {
      setIsSubmitting(true)
      const result = coffee
        ? await updateCoffee(coffee.id, data)
        : await createCoffee(data)

      if (result.success) {
        onSuccess?.(result.data)
        toast(coffee ? "Café atualizado com sucesso!" : "Café criado com sucesso!")
        router.push("/coffees")
        router.refresh()
      }
    } catch (error) {
      console.error("Erro ao salvar café:", error)
      toast("Erro ao salvar café. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensoryProfile">Perfil sensorial</Label>
              <Textarea id="sensoryProfile" {...register("sensoryProfile")} />
              {errors.sensoryProfile && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.sensoryProfile.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Região</Label>
              <Input id="region" {...register("region")} />
              {errors.region && (
                <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="producer">Produtor</Label>
              <Input id="producer" {...register("producer")} />
              {errors.producer && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.producer.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="variety">Variedade</Label>
              <Input id="variety" {...register("variety")} />
              {errors.variety && (
                <p className="text-sm text-red-500 mt-1">{errors.variety.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="process">Processo</Label>
              <Input id="process" {...register("process")} />
              {errors.process && (
                <p className="text-sm text-red-500 mt-1">{errors.process.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="altitude">Altitude</Label>
              <Input id="altitude" {...register("altitude")} />
              {errors.altitude && (
                <p className="text-sm text-red-500 mt-1">{errors.altitude.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Classificação</Label>
              <Rating
                value={rating}
                onChange={(value) => setValue("rating", value)}
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
              {isSubmitting ? "Salvando..." : coffee ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

