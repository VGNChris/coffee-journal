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

interface CoffeeFormProps {
  coffee?: Coffee
}

export function CoffeeForm({ coffee }: CoffeeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const coffeeData = {
      name: formData.get("name") as string,
      sensoryProfile: formData.get("sensoryProfile") as string,
      region: formData.get("region") as string,
      producer: formData.get("producer") as string,
      variety: formData.get("variety") as string,
      process: formData.get("process") as string,
      altitude: formData.get("altitude") as string,
    }

    try {
      if (coffee) {
        await updateCoffee(coffee.id, coffeeData)
      } else {
        await createCoffee(coffeeData)
      }
      router.push("/coffees")
      router.refresh()
    } catch (error) {
      console.error("Error saving coffee:", error)
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
              <Label htmlFor="name">Coffee Name</Label>
              <Input id="name" name="name" defaultValue={coffee?.name || ""} required />
            </div>

            <div>
              <Label htmlFor="sensoryProfile">Sensory Profile</Label>
              <Textarea
                id="sensoryProfile"
                name="sensoryProfile"
                placeholder="Describe the flavor notes (e.g., Citrus, Chocolate, Floral)"
                defaultValue={coffee?.sensoryProfile || ""}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="Country or specific region"
                  defaultValue={coffee?.region || ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="producer">Producer</Label>
                <Input
                  id="producer"
                  name="producer"
                  placeholder="Farm or cooperative name"
                  defaultValue={coffee?.producer || ""}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  name="variety"
                  placeholder="E.g., Bourbon, Typica, Gesha"
                  defaultValue={coffee?.variety || ""}
                  required
                />
              </div>

              <div>
                <Label htmlFor="process">Process</Label>
                <Input
                  id="process"
                  name="process"
                  placeholder="E.g., Washed, Natural, Honey"
                  defaultValue={coffee?.process || ""}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="altitude">Altitude</Label>
              <Input
                id="altitude"
                name="altitude"
                placeholder="E.g., 1200-1500m"
                defaultValue={coffee?.altitude || ""}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/coffees">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : coffee ? "Update Coffee" : "Add Coffee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

