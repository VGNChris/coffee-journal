import { getCoffees } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { notFound } from "next/navigation"
import { BrewForm } from "@/components/brew-form"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewBrewPage({ searchParams }: { searchParams: { coffeeId?: string } }) {
  const coffees = await getCoffees()

  if (coffees.length === 0) {
    notFound()
  }

  const selectedCoffeeId = searchParams.coffeeId ? Number.parseInt(searchParams.coffeeId) : undefined
  const selectedCoffee = selectedCoffeeId ? coffees.find(coffee => coffee.id === selectedCoffeeId) : undefined

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href={selectedCoffee ? `/coffees/${selectedCoffee.id}` : "/brews"}>
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar {selectedCoffee ? "ao café" : "ao diário do barista"}
          </Button>
        </Link>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Novo preparo</h1>
        {selectedCoffee && (
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Registrando preparo para {selectedCoffee.name}
          </p>
        )}
      </div>

      <div className="max-w-2xl">
        <BrewForm coffees={coffees} selectedCoffeeId={selectedCoffeeId} />
      </div>
    </div>
  )
}

