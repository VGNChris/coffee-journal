"use client"

import type React from "react"

import { useState } from "react"
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
  const [acidity, setAcidity] = useState<number>(brew?.acidity || 3)
  const [sweetness, setSweetness] = useState<number>(brew?.sweetness || 3)
  const [body, setBody] = useState<number>(brew?.body || 3)

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
      brewingMethod: brew?.brewingMethod || "",
      waterTemperature: brew?.waterTemperature || 0,
      grinderSetting: brew?.grinderSetting || 0,
      extractionTime: brew?.extractionTime || 0,
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

  const onSubmit = async (data: BrewFormData) => {
    try {
      setIsSubmitting(true)
      const result = brew
        ? await updateBrew(brew.id, data)
        : await createBrew(data)

      if (result.success) {
        onSuccess?.(result.data)
        router.push("/brews")
        router.refresh()
        toast(brew ? "Preparo atualizado com sucesso!" : "Preparo criado com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao salvar preparo:", error)
      toast("Erro ao salvar preparo. Por favor, tente novamente.")
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
              <Select {...register("brewingMethod")} required>
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
                  value={[acidity]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setAcidity(value[0])}
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
                  value={[sweetness]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setSweetness(value[0])}
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
                  value={[body]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setBody(value[0])}
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
            <Link href="/brews">
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

