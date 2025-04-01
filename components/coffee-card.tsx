import type { Coffee } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CoffeeIcon as CoffeeBeaker, MapPin } from "lucide-react"

interface CoffeeCardProps {
  coffee: Coffee
}

export function CoffeeCard({ coffee }: CoffeeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">{coffee.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {coffee.region}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Sensory Profile:</span>
            <p className="text-sm text-muted-foreground line-clamp-1">{coffee.sensoryProfile}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Process:</span>
            <p className="text-sm text-muted-foreground">{coffee.process}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Variety:</span>
            <p className="text-sm text-muted-foreground">{coffee.variety}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/coffees/${coffee.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/brews/new?coffeeId=${coffee.id}`}>
          <Button size="sm">
            <CoffeeBeaker className="mr-2 h-4 w-4" />
            Add Brew
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

