import Link from "next/link"
import { Coffee, CoffeeIcon as CoffeeBeaker, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Coffee Journal</h1>
          <p className="text-lg text-muted-foreground">
            Track your coffee brewing experiences and discover your perfect cup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/coffees"
            className="bg-card hover:bg-card/90 transition-colors border rounded-lg p-6 flex flex-col items-center text-center"
          >
            <Coffee size={48} className="mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Coffee Library</h2>
            <p className="text-muted-foreground">
              Manage your coffee collection with details on origin, process, and flavor profiles
            </p>
          </Link>

          <Link
            href="/brews"
            className="bg-card hover:bg-card/90 transition-colors border rounded-lg p-6 flex flex-col items-center text-center"
          >
            <CoffeeBeaker size={48} className="mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Brewing Journal</h2>
            <p className="text-muted-foreground">
              Record brewing methods, parameters, and tasting notes for each coffee experience
            </p>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">First time setup? Initialize your database:</p>
          <Link href="/api/setup">
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Setup Database
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

