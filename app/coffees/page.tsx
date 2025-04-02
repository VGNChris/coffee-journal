import { getCoffees } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coffee, Plus } from "lucide-react"
import { CoffeeCard } from "@/components/coffee-card"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CoffeesPage() {
  const coffees = await getCoffees()

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Meus cafés</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Gerencie sua coleção de cafés</p>
        </div>
        <Link href="/coffees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar café
          </Button>
        </Link>
      </div>

      {coffees.length === 0 ? (
        <div className="text-center py-8 md:py-12 border rounded-lg bg-card">
          <Coffee className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg md:text-xl font-medium mb-2">Sem cafés aqui</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">Adicione seu primeiro café para começar</p>
          <Link href="/coffees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4"/> Adicionar café
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {coffees.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </div>
      )}
    </div>
  )
}

