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
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

interface BrewFormProps {
  brew?: Brew
  coffees: Coffee[]
  selectedCoffeeId?: number
}

export function BrewForm({ brew, coffees, selectedCoffeeId }: BrewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coffeeId, setCoffeeId] = useState<string>((brew?.coffee.id || selectedCoffeeId || "").toString())
  const [acidity, setAcidity] = useState<number>(brew?.acidity || 3)
  const [sweetness, setSweetness] = useState<number>(brew?.sweetness || 3)
  const [body, setBody] = useState<number>(brew?.body || 3)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const brewData = {
      coffeeId: Number.parseInt(coffeeId),
      brewingMethod: formData.get("brewingMethod") as string,
      waterTemperature: Number.parseInt(formData.get("waterTemperature") as string),
      grinderSetting: Number.parseInt(formData.get("grinderSetting") as string),
      extractionTime: Number.parseInt(formData.get("extractionTime") as string),
      acidity,
      sweetness,
      body,
      notes: formData.get("notes") as string,
    }

    try {
      if (brew) {
        await updateBrew(brew.id, brewData)
      } else {
        await createBrew(brewData)
      }
      router.push("/brews")
      router.refresh()
      toast.success("Preparo salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar preparo:", error)
      toast.error("Erro ao salvar preparo. Por favor, tente novamente mais tarde.")
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
              <Select name="brewingMethod" defaultValue={brew?.brewingMethod || "V60"} required>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="waterTemperature">Temperatura da água (°C)</Label>
                <Input
                  id="waterTemperature"
                  name="waterTemperature"
                  type="number"
                  min="70"
                  max="100"
                  defaultValue={brew?.waterTemperature || 93}
                  required
                />
              </div>

              <div>
                <Label htmlFor="grinderSetting">Click do moedor</Label>
                <Input
                  id="grinderSetting"
                  name="grinderSetting"
                  type="number"
                  min="1"
                  max="40"
                  defaultValue={brew?.grinderSetting || 15}
                  required
                />
              </div>

              <div>
                <Label htmlFor="extractionTime">Tempo de extração (segundos)</Label>
                <Input
                  id="extractionTime"
                  name="extractionTime"
                  type="number"
                  min="10"
                  max="600"
                  defaultValue={brew?.extractionTime || 120}
                  required
                />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Acidez (1-5)</Label>
                  <span className="text-muted-foreground">{acidity}</span>
                </div>
                <Slider value={[acidity]} min={1} max={5} step={1} onValueChange={(value) => setAcidity(value[0])} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Doçura (1-5)</Label>
                  <span className="text-muted-foreground">{sweetness}</span>
                </div>
                <Slider
                  value={[sweetness]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setSweetness(value[0])}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Corpo (1-5)</Label>
                  <span className="text-muted-foreground">{body}</span>
                </div>
                <Slider value={[body]} min={1} max={5} step={1} onValueChange={(value) => setBody(value[0])} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea name="notes" placeholder="Descreva suas impressões sobre o preparo..." />
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

