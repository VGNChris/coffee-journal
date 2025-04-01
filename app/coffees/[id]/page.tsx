import { getCoffeeById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, CoffeeIcon as CoffeeBeaker } from "lucide-react"
import { notFound } from "next/navigation"

export default async function CoffeeDetailPage({ params }: { params: { id: string } }) {
  const coffee = await getCoffeeById(Number.parseInt(params.id))

  if (!coffee) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/coffees">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Coffee Library
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">{coffee.name}</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/coffees/${coffee.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit Coffee
            </Button>
          </Link>
          <Link href={`/brews/new?coffeeId=${coffee.id}`}>
            <Button>
              <CoffeeBeaker className="mr-2 h-4 w-4" /> Add Brew
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Coffee Details</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Sensory Profile</dt>
              <dd className="mt-1">{coffee.sensoryProfile}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Region</dt>
              <dd className="mt-1">{coffee.region}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Producer</dt>
              <dd className="mt-1">{coffee.producer}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Variety</dt>
              <dd className="mt-1">{coffee.variety}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Process</dt>
              <dd className="mt-1">{coffee.process}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Altitude</dt>
              <dd className="mt-1">{coffee.altitude}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Brews</h2>
          {/* This would be populated with actual brew data */}
          <p className="text-muted-foreground">No brews recorded yet for this coffee.</p>
          <div className="mt-4">
            <Link href={`/brews/new?coffeeId=${coffee.id}`}>
              <Button>
                <CoffeeBeaker className="mr-2 h-4 w-4" /> Add Brew
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

