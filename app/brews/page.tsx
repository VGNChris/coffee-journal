import { getBrews } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { BookIcon } from "@/components/icons/book-icon"
import { BrewCard } from "@/components/brew-card"

export default async function BrewsPage() {
  const brews = await getBrews()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Diário do barista</h1>
          <p className="text-muted-foreground mt-1">Seu Banco de Dados Sensorial: armazene métodos, métricas e impressões de cada extração. Compare, analise e eleve sua expertise de home barista.🔍📊</p>
        </div>
        <Link href="/brews/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar preparo
          </Button>
        </Link>
      </div>

      {brews.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <BookIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Sem preparos aqui</h3>
          <p className="text-muted-foreground mb-4">Adicione seu primeiro preparo para começar sua experiência</p>
          <Link href="/brews/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar preparo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {brews.map((brew) => (
            <BrewCard key={brew.id} brew={brew} />
          ))}
        </div>
      )}
    </div>
  )
}

