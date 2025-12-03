"use client"

import React, { useState, useEffect } from "react"
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
import { Loader2 } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const brewSchema = z.object({
  coffeeId: z.string().min(1, "Café é obrigatório"),
  brewingMethod: z.string().min(1, "Método de preparo é obrigatório"),
  dose: z.coerce.number({ required_error: "Dose é obrigatória" }).min(0, "Dose deve ser positiva"),
  waterAmount: z.coerce.number({ required_error: "Quantidade de água é obrigatória" }).min(0, "Água deve ser positiva"),
  ratio: z.string().min(1, "Proporção é obrigatória"),
  waterTemperature: z.coerce.number({ required_error: "Temperatura é obrigatória" }).min(70, "Mínimo 70°C").max(100, "Máximo 100°C"),
  grinderSetting: z.coerce.number({ required_error: "Moagem é obrigatória" }).min(1, "Moagem deve ser no mínimo 1").max(250, "Moagem deve ser no máximo 250"),
  extractionTime: z.coerce.number({ required_error: "Tempo é obrigatório" }).min(10, "Mínimo 10s").max(600, "Máximo 600s"),
  acidity: z.number().min(0).max(10),
  sweetness: z.number().min(0).max(10),
  body: z.number().min(0).max(10),
  rating: z.number().min(0, "Classificação é obrigatória").max(5),
  brewDate: z.string().min(1, "Data do preparo é obrigatória"),
  brewTime: z.string().min(1, "Hora do preparo é obrigatória"),
  notes: z.string().optional(),
})

type BrewFormData = z.infer<typeof brewSchema>

interface BrewFormProps {
  brew: Brew | null
  coffees: Coffee[]
  onSuccess: (brew: Brew) => void
}

export function BrewForm({ brew, coffees, onSuccess }: BrewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedCoffeeId = brew?.coffeeId

  const form = useForm<BrewFormData>({
    resolver: zodResolver(brewSchema),
    defaultValues: brew
      ? {
          ...brew,
          coffeeId: brew.coffeeId.toString(),
          notes: brew.notes ?? "",
        }
      : {
          coffeeId: "",
          brewingMethod: "",
          dose: 20,
          waterAmount: 300,
          ratio: "1:15",
          waterTemperature: 92,
          grinderSetting: 20,
          extractionTime: 180,
          acidity: 5,
          sweetness: 5,
          body: 5,
          rating: 0,
          brewDate: new Date().toISOString().split("T")[0],
          brewTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
          notes: "",
        },
  })

  const dose = form.watch("dose")
  const waterAmount = form.watch("waterAmount")

  useEffect(() => {
    if (dose > 0 && waterAmount > 0) {
      const newRatio = (waterAmount / dose).toFixed(1)
      form.setValue("ratio", `1:${newRatio}`)
    } else {
      form.setValue("ratio", "1:0")
    }
  }, [dose, waterAmount, form.setValue])

  const onSubmit = async (data: BrewFormData) => {
    try {
      setIsSubmitting(true)
      console.log("Dados do formulário:", data)

      const formattedData = {
        ...data,
        coffeeId: Number(data.coffeeId)
      }

      console.log("Dados formatados:", formattedData)

      let result
      if (brew) {
        console.log("Atualizando preparo:", brew.id)
        result = await updateBrew(brew.id, formattedData)
        console.log("Resultado da atualização:", result)
      } else {
        console.log("Criando novo preparo")
        result = await createBrew(formattedData)
        console.log("Resultado da criação:", result)
      }

      if (result.success) {
        toast.success(brew ? "Preparo atualizado com sucesso!" : "Preparo criado com sucesso!")
        if (onSuccess) {
          onSuccess(result.data)
        } else {
          router.push("/brews")
        }
      } else {
        throw new Error(brew ? "Falha ao atualizar preparo" : "Falha ao criar preparo")
      }
    } catch (error) {
      console.error("Erro ao salvar preparo:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao salvar preparo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="coffeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Café</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={selectedCoffeeId?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um café" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coffees.map((coffee) => (
                      <SelectItem key={coffee.id} value={coffee.id.toString()}>
                        {coffee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brewingMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de extração</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="V60">V60</SelectItem>
                    <SelectItem value="Aeropress">Aeropress</SelectItem>
                    <SelectItem value="Chemex">Chemex</SelectItem>
                    <SelectItem value="Kalita">Kalita</SelectItem>
                    <SelectItem value="French Press">French Press</SelectItem>
                    <SelectItem value="Clever">Clever</SelectItem>
                    <SelectItem value="Espresso">Espresso</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dose de café (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="99999"
                      step="0.1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waterAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de água (ml)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ratio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proporção</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="1:15"
                      {...field}
                      readOnly
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="waterTemperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura da água (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="70"
                      max="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grinderSetting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Click do moedor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="250"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="extractionTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de extração (segundos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="10"
                      max="600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="acidity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between mb-2">
                    <FormLabel>Acidez (0-10)</FormLabel>
                    <span className="text-muted-foreground">{field.value ?? 0}</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[Number(field.value ?? 0)]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sweetness"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between mb-2">
                    <FormLabel>Doçura (0-10)</FormLabel>
                    <span className="text-muted-foreground">{field.value ?? 0}</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[Number(field.value ?? 0)]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between mb-2">
                    <FormLabel>Corpo (0-10)</FormLabel>
                    <span className="text-muted-foreground">{field.value ?? 0}</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[Number(field.value ?? 0)]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classificação</FormLabel>
                <FormControl>
                  <Rating
                    value={Number(field.value)}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brewDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do preparo</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brewTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora do preparo</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Adicione suas observações sobre o preparo..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/brews")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : brew ? (
              "Salvar alterações"
            ) : (
              "Criar preparo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
