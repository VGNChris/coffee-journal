import { getBrews } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CoffeeIcon as CoffeeBeaker, Plus } from "lucide-react"
import { BrewCard } from "@/components/brew-card"

export default async function BrewsPage() {
  const brews = await getBrews()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Brewing Journal</h1>
          <p className="text-muted-foreground mt-1">Record your coffee brewing experiences</p>
        </div>
        <Link href="/brews/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Brew
          </Button>
        </Link>
      </div>

      {brews.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <CoffeeBeaker className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No brews recorded yet</h3>
          <p className="text-muted-foreground mb-4">Add your first brewing experience to get started</p>
          <Link href="/brews/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Brew
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {brews.map((brew) => (
            <BrewCard key={brew.id} brew={brew} />
          ))}
        </div>
      )}
    </div>
  )
}

