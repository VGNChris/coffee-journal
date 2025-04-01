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
              <div className="text-xs text-muted-foreground">Acidity</div>
            </div>
            <div className="text-center px-2">
              <div className="text-lg font-bold">{brew.sweetness}</div>
              <div className="text-xs text-muted-foreground">Sweetness</div>
            </div>
            <div className="text-center px-2">
              <div className="text-lg font-bold">{brew.body}</div>
              <div className="text-xs text-muted-foreground">Body</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <span className="text-sm font-medium">Water Temp:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.waterTemperature}°C</span>
          </div>
          <div>
            <span className="text-sm font-medium">Grinder:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.grinderSetting}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Time:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.extractionTime}s</span>
          </div>
          <div>
            <span className="text-sm font-medium">Process:</span>
            <span className="text-sm text-muted-foreground ml-1">{brew.coffee.process}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/brews/${brew.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/coffees/${brew.coffee.id}`}>
          <Button variant="secondary" size="sm">
            <Coffee className="mr-2 h-4 w-4" />
            View Coffee
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

