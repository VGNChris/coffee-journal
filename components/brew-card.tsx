import type { Brew } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coffee } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface BrewCardProps {
  brew: Brew
}

export function BrewCard({ brew }: BrewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{brew.coffee.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {brew.brewingMethod} • {formatDate(brew.createdAt)}
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="text-center px-2">
              <div className="text-lg font-bold">{brew.acidity}</div>
              <div className="text-xs text-muted-foreground">Acidez</div>
            </div>
            <div className="text-center px-2">
              <div className="text-lg font-bold">{brew.sweetness}</div>
              <div className="text-xs text-muted-foreground">Doçura</div>
            </div>
            <div className="text-center px-2">
              <div className="text-lg font-bold">{brew.body}</div>
              <div className="text-xs text-muted-foreground">Corpo</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <span className="text-sm font-medium">Temperatura da água (ºc):</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.waterTemperature}°C</span>
          </div>
          <div>
            <span className="text-sm font-medium">Click do moedor:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.grinderSetting}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Tempo total de extração:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.extractionTime}s</span>
          </div>
          <div>
            <span className="text-sm font-medium">Processo:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.coffee.process}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/brews/${brew.id}`}>
          <Button variant="outline" size="sm">
            Ver detalhes
          </Button>
        </Link>
        <Link href={`/coffees/${brew.coffee.id}`}>
          <Button variant="secondary" size="sm">
            <Coffee className="mr-2 h-4 w-4" />
            Ver café
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

