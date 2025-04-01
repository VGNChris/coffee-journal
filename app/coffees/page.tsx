import { getCoffees } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coffee, Plus } from "lucide-react"
import { CoffeeCard } from "@/components/coffee-card"

export default async function CoffeesPage() {
  const coffees = await getCoffees()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coffee Library</h1>
          <p className="text-muted-foreground mt-1">Manage your coffee collection</p>
        </div>
        <Link href="/coffees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Coffee
          </Button>
        </Link>
      </div>

      {coffees.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <Coffee className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No coffees yet</h3>
          <p className="text-muted-foreground mb-4">Add your first coffee to get started</p>
          <Link href="/coffees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Coffee
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffees.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </div>
      )}
    </div>
  )
}

