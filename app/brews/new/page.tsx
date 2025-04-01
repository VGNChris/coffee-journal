import { BrewForm } from "@/components/brew-form"
import { getCoffees } from "@/lib/data"

export default async function NewBrewPage({ searchParams }: { searchParams: { coffeeId?: string } }) {
  const coffees = await getCoffees()
  const selectedCoffeeId = searchParams.coffeeId ? Number.parseInt(searchParams.coffeeId) : undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Adicionar novo preparo</h1>
      <BrewForm coffees={coffees} selectedCoffeeId={selectedCoffeeId} />
    </div>
  )
}

