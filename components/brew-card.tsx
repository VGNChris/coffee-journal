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
            <CardTitle className="line-clamp-1">{brew.coffee?.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {brew.brewingMethod} • {formatDate(brew.brewDate)} às {brew.brewTime}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Dose</div>
            <div>{brew.dose}g</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Água</div>
            <div>{brew.waterAmount}ml</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Proporção</div>
            <div>{brew.ratio}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Temperatura</div>
            <div>{brew.waterTemperature}°C</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Moagem</div>
            <div>Click {brew.grinderSetting}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Extração</div>
            <div>{brew.extractionTime}s</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/brews/${brew.id}`} className="w-full">
          <Button variant="secondary" className="w-full">
            <Coffee className="mr-2 h-4 w-4" />
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

