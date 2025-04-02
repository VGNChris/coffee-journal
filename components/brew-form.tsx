"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Brew, Coffee } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createBrew, updateBrew } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Rating } from "@/components/ui/rating"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const brewSchema = z.object({
  coffeeId: z.number(),
  brewingMethod: z.string().min(1, "Método de preparo é obrigatório"),
  waterTemperature: z.number().min(0).max(100),
  grinderSetting: z.number().min(0),
  extractionTime: z.number().min(0),
  acidity: z.number().min(0).max(10),
  sweetness: z.number().min(0).max(10),
  body: z.number().min(0).max(10),
  rating: z.number().min(0).max(5),
  brewDate: z.string().min(1, "Data do preparo é obrigatória"),
  brewTime: z.string().min(1, "Hora do preparo é obrigatória"),
  notes: z.string().optional(),
})

type BrewFormData = z.infer<typeof brewSchema>

interface BrewFormProps {
  brew?: Brew
  coffees: Coffee[]
  selectedCoffeeId?: number
  onSuccess?: (brew: Brew) => void
}

export function BrewForm({ brew, coffees, selectedCoffeeId, onSuccess }: BrewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coffeeId, setCoffeeId] = useState<string>((brew?.coffeeId || selectedCoffeeId || "").toString())

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BrewFormData>({
    resolver: zodResolver(brewSchema),
    defaultValues: {
      coffeeId: Number.parseInt(coffeeId) || brew?.coffeeId || 0,
      brewingMethod: brew?.brewingMethod || "V60",
      waterTemperature: brew?.waterTemperature || 92,
      grinderSetting: brew?.grinderSetting || 15,
      extractionTime: brew?.extractionTime || 180,
      acidity: brew?.acidity || 3,
      sweetness: brew?.sweetness || 3,
      body: brew?.body || 3,
      rating: brew?.rating || 0,
      brewDate: brew?.brewDate || new Date().toISOString().split('T')[0],
      brewTime: brew?.brewTime || new Date().toTimeString().slice(0, 5),
      notes: brew?.notes || "",
    },
  })

  const rating = watch("rating")
  const acidity = watch("acidity")
  const sweetness = watch("sweetness")
  const body = watch("body")

  useEffect(() => {
    if (coffeeId) {
      setValue("coffeeId", Number.parseInt(coffeeId))
    }
  }, [coffeeId, setValue])

  const onSubmit = async (values: z.infer<typeof brewSchema>) => {
    try {
      setIsSubmitting(true)
      console.log("Enviando dados do formulário:", values)
      
      const brewData = {
        coffeeId: Number(coffeeId),
        brewingMethod: values.brewingMethod,
        waterTemperature: Number(values.waterTemperature),
        grinderSetting: Number(values.grinderSetting),
        extractionTime: Number(values.extractionTime),
        acidity: Number(values.acidity),
        sweetness: Number(values.sweetness),
        body: Number(values.body),
        rating: Number(values.rating),
        brewDate: values.brewDate,
        brewTime: values.brewTime,
        notes: values.notes || undefined
      }

      console.log("Dados formatados para envio:", brewData)
      
      const result = await createBrew(brewData)
      console.log("Resultado da criação:", result)
      
      if (result.success) {
        toast.success("Preparo salvo com sucesso!")
        if (coffeeId) {
          router.push(`/coffees/${coffeeId}`)
        } else {
          router.push("/brews")
        }
      } else {
        throw new Error("Falha ao salvar preparo")
      }
    } catch (error) {
      console.error("Erro ao salvar preparo:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao salvar preparo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="coffeeId">Café</Label>
              <Select value={coffeeId} onValueChange={setCoffeeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o café" />
                </SelectTrigger>
                <SelectContent>
                  {coffees.map((coffee) => (
                    <SelectItem key={coffee.id} value={coffee.id.toString()}>
                      {coffee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {coffees.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhum café disponível.{" "}
                  <Link href="/coffees/new" className="text-primary">
                    Adicione um café
                  </Link>{" "}
                  primeiro.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="brewingMethod">Método de extração</Label>
              <Select 
                value={watch("brewingMethod")} 
                onValueChange={(value) => setValue("brewingMethod", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método de extração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V60">V60</SelectItem>
                  <SelectItem value="French Press">Prensa Francesa</SelectItem>
                  <SelectItem value="Espresso">Espresso</SelectItem>
                  <SelectItem value="Other">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.brewingMethod && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.brewingMethod.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="waterTemperature">Temperatura da água (°C)</Label>
                <Input
                  id="waterTemperature"
                  type="number"
                  {...register("waterTemperature", { valueAsNumber: true })}
                  min="70"
                  max="100"
                  required
                />
                {errors.waterTemperature && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.waterTemperature.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="grinderSetting">Click do moedor</Label>
                <Input
                  id="grinderSetting"
                  type="number"
                  {...register("grinderSetting", { valueAsNumber: true })}
                  min="1"
                  max="40"
                  required
                />
                {errors.grinderSetting && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.grinderSetting.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="extractionTime">Tempo de extração (segundos)</Label>
                <Input
                  id="extractionTime"
                  type="number"
                  {...register("extractionTime", { valueAsNumber: true })}
                  min="10"
                  max="600"
                  required
                />
                {errors.extractionTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.extractionTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Acidez (0-10)</Label>
                  <span className="text-muted-foreground">{acidity}</span>
                </div>
                <Slider
                  defaultValue={[acidity]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value: number[]) => setValue("acidity", value[0])}
                />
                {errors.acidity && (
                  <p className="text-sm text-red-500 mt-1">{errors.acidity.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Doçura (0-10)</Label>
                  <span className="text-muted-foreground">{sweetness}</span>
                </div>
                <Slider
                  defaultValue={[sweetness]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value: number[]) => setValue("sweetness", value[0])}
                />
                {errors.sweetness && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.sweetness.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Corpo (0-10)</Label>
                  <span className="text-muted-foreground">{body}</span>
                </div>
                <Slider
                  defaultValue={[body]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value: number[]) => setValue("body", value[0])}
                />
                {errors.body && (
                  <p className="text-sm text-red-500 mt-1">{errors.body.message}</p>
                )}
              </div>

              <div>
                <Label>Classificação</Label>
                <Rating
                  value={rating}
                  onChange={(value) => setValue("rating", value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brewDate">Data do preparo</Label>
                <Input
                  id="brewDate"
                  type="date"
                  {...register("brewDate")}
                  required
                />
                {errors.brewDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.brewDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="brewTime">Hora do preparo</Label>
                <Input
                  id="brewTime"
                  type="time"
                  {...register("brewTime")}
                  required
                />
                {errors.brewTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.brewTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" {...register("notes")} />
              {errors.notes && (
                <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href={selectedCoffeeId ? `/coffees/${selectedCoffeeId}` : "/brews"}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || coffees.length === 0}>
              {isSubmitting ? "Salvando..." : brew ? "Atualizar preparo" : "Adicionar preparo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

