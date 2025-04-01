import Link from "next/link"
import { Coffee, CoffeeIcon as CoffeeBeaker, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Diário do café</h1>
          <p className="text-lg text-muted-foreground">
          Anote, ajuste, repita! Transforme cada café em uma experiência personalizada e descubra a combinação que faz seu coração (e seu paladar) vibrar. 🔥
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/coffees"
            className="bg-card hover:bg-card/90 transition-colors border rounded-lg p-6 flex flex-col items-center text-center"
          >
            <Coffee size={48} className="mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Meus cafés</h2>
            <p className="text-muted-foreground">
            Viaje pelas origens, processos e aromas do seu café. Organize sua coleção como um curador de experiências, onde cada grão revela um capítulo de sabor e tradição.
            </p>
          </Link>

          <Link
            href="/brews"
            className="bg-card hover:bg-card/90 transition-colors border rounded-lg p-6 flex flex-col items-center text-center"
          >
            <CoffeeBeaker size={48} className="mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Diário do barista</h2>
            <p className="text-muted-foreground">
            Seu Banco de Dados Sensorial: armazene métodos, métricas e impressões de cada extração. Compare, analise e eleve sua expertise de home barista.🔍📊 
            </p>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Primeiro uso? Inicialize o banco de dados:</p>
          <Link href="/api/setup">
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Configure o banco de dados
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

