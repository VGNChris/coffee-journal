"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Brew, Coffee } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrew, updateBrew } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"

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
    }

    try {
      if (brew) {
        await updateBrew(brew.id, brewData)
      } else {
        await createBrew(brewData)
      }
      router.push("/brews")
      router.refresh()
    } catch (error) {
      console.error("Error saving brew:", error)
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
              <Label htmlFor="coffeeId">Coffee</Label>
              <Select value={coffeeId} onValueChange={setCoffeeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a coffee" />
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
                  No coffees available.{" "}
                  <Link href="/coffees/new" className="text-primary">
                    Add a coffee
                  </Link>{" "}
                  first.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="brewingMethod">Brewing Method</Label>
              <Select name="brewingMethod" defaultValue={brew?.brewingMethod || "V60"} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select brewing method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V60">V60</SelectItem>
                  <SelectItem value="French Press">French Press</SelectItem>
                  <SelectItem value="Espresso">Espresso</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="waterTemperature">Water Temperature (°C)</Label>
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
                <Label htmlFor="grinderSetting">Grinder Setting</Label>
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
                <Label htmlFor="extractionTime">Extraction Time (seconds)</Label>
                <Input
                  id="extractionTime"
                  name="extractionTime"
                  type="number"
                  min="10"
                  max="300"
                  defaultValue={brew?.extractionTime || 120}
                  required
                />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Acidity (1-5)</Label>
                  <span className="text-muted-foreground">{acidity}</span>
                </div>
                <Slider value={[acidity]} min={1} max={5} step={1} onValueChange={(value) => setAcidity(value[0])} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Sweetness (1-5)</Label>
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
                  <Label>Body (1-5)</Label>
                  <span className="text-muted-foreground">{body}</span>
                </div>
                <Slider value={[body]} min={1} max={5} step={1} onValueChange={(value) => setBody(value[0])} />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/brews">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || coffees.length === 0}>
              {isSubmitting ? "Saving..." : brew ? "Update Brew" : "Add Brew"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

