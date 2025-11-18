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
import { Loader2 } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const brewSchema = z.object({
  coffeeId: z.string().min(1, "Café é obrigatório"),
  brewingMethod: z.string().min(1, "Método de preparo é obrigatório"),
  dose: z.string().min(1, "Dose é obrigatória"),
  waterAmount: z.string().min(1, "Quantidade de água é obrigatória"),
  ratio: z.string().min(1, "Proporção é obrigatória"),
  waterTemperature: z.string().min(1, "Temperatura é obrigatória"),
  grinderSetting: z.string().min(1, "Configuração do moinho é obrigatória"),
  extractionTime: z.string().min(1, "Tempo de extração é obrigatório"),
  acidity: z.string().min(1, "Acidez é obrigatória"),
  sweetness: z.string().min(1, "Doçura é obrigatória"),
  body: z.string().min(1, "Corpo é obrigatório"),
  rating: z.string().min(1, "Classificação é obrigatória"),
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
    defaultValues: {
      coffeeId: brew?.coffeeId?.toString() || "",
      brewingMethod: brew?.brewingMethod || "",
      dose: brew?.dose?.toString() || "20",
      waterAmount: brew?.waterAmount?.toString() || "300",
      ratio: brew?.ratio || "1:15",
      waterTemperature: brew?.waterTemperature?.toString() || "92",
      grinderSetting: brew?.grinderSetting?.toString() || "15",
      extractionTime: brew?.extractionTime?.toString() || "180",
      acidity: brew?.acidity?.toString() || "5",
      sweetness: brew?.sweetness?.toString() || "5",
      body: brew?.body?.toString() || "5",
      rating: brew?.rating?.toString() || "0",
      brewDate: brew?.brewDate || new Date().toISOString().split("T")[0],
      brewTime: brew?.brewTime || new Date().toTimeString().split(" ")[0].slice(0, 5),
      notes: brew?.notes || ""
    }
  })

  const onSubmit = async (data: BrewFormData) => {
    try {
      setIsSubmitting(true)
      console.log("Dados do formulário:", data)

      const formattedData = {
        coffeeId: Number(data.coffeeId),
        brewingMethod: data.brewingMethod,
        dose: Number(data.dose),
        waterAmount: Number(data.waterAmount),
        ratio: data.ratio,
        waterTemperature: Number(data.waterTemperature),
        grinderSetting: Number(data.grinderSetting),
        extractionTime: Number(data.extractionTime),
        acidity: Number(data.acidity),
        sweetness: Number(data.sweetness),
        body: Number(data.body),
        rating: Number(data.rating),
        brewDate: data.brewDate,
        brewTime: data.brewTime,
        notes: data.notes || undefined
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
                      max="100"
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
                      max="99999"
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
                    <span className="text-muted-foreground">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[Number(field.value)]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0].toString())}
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
                    <span className="text-muted-foreground">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[Number(field.value)]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0].toString())}
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
                    <span className="text-muted-foreground">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[Number(field.value)]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0].toString())}
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
                    onChange={(value) => field.onChange(value.toString())}
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

