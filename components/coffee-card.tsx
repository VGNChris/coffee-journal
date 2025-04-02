import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Rating } from "@/components/ui/rating"
import type { Coffee } from "@/lib/types"

interface CoffeeCardProps {
  coffee: Coffee
}

export function CoffeeCard({ coffee }: CoffeeCardProps) {
  return (
    <Link href={`/coffees/${coffee.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold leading-none tracking-tight">{coffee.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{coffee.sensoryProfile}</p>
            </div>
            <Rating value={coffee.rating} readOnly size="sm" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{coffee.region}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Produtor:</span> {coffee.producer}
            </div>
            <div>
              <span className="text-muted-foreground">Variedade:</span> {coffee.variety}
            </div>
            <div>
              <span className="text-muted-foreground">Processo:</span> {coffee.process}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

