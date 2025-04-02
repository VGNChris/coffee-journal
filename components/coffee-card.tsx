import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Coffee } from "@/lib/types"

interface CoffeeCardProps {
  coffee: Coffee
}

export function CoffeeCard({ coffee }: CoffeeCardProps) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-4 md:p-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-base md:text-lg line-clamp-1">
                {coffee.name}
              </h3>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="text-sm line-clamp-1">{coffee.region}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <dt className="sr-only">Perfil sensorial</dt>
              <dd className="text-sm text-muted-foreground line-clamp-2">
                {coffee.sensoryProfile}
              </dd>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex-1 min-w-[120px]">
                <dt className="text-muted-foreground">Processo</dt>
                <dd className="font-medium truncate">{coffee.process}</dd>
              </div>
              <div className="flex-1 min-w-[120px]">
                <dt className="text-muted-foreground">Variedade</dt>
                <dd className="font-medium truncate">{coffee.variety}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 pt-0 mt-2">
        <Link href={`/coffees/${coffee.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver detalhes
          </Button>
        </Link>
      </div>
    </div>
  )
}

