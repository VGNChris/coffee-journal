import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee } from "lucide-react"
import { BookIcon } from "@/components/icons/book-icon"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Bem-vindo ao Coffee Journal</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Registre seus cafés e preparos para aprimorar sua experiência com café especial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center">
              <Coffee className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold mb-2">Diário do Café</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Registre informações sobre seus cafés especiais, como origem, variedade e processo
              </p>
              <Link href="/coffees">
                <Button>
                  <Coffee className="mr-2 h-4 w-4" /> Ver meus cafés
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center">
              <BookIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold mb-2">Diário do Barista</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Registre seus preparos, acompanhe a evolução e aprimore sua técnica
              </p>
              <Link href="/brews">
                <Button>
                  <BookIcon className="mr-2 h-4 w-4" /> Ver meus preparos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

