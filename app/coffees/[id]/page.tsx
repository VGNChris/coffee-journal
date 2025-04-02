import { getCoffeeById, getBrewsByCoffeeId } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit } from 'lucide-react'
import { BookIcon } from "@/components/icons/book-icon"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Rating } from "@/components/ui/rating"
import { DeleteCoffeeButton } from "@/components/delete-coffee-button"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CoffeePage({ params }: { params: { id: string } }) {
  console.log("Renderizando página do café com ID:", params.id)
  
  const id = parseInt(params.id)
  if (isNaN(id)) {
    console.error("ID inválido:", params.id)
    notFound()
  }

  try {
    const coffee = await getCoffeeById(id)
    console.log("Café retornado:", coffee)

    if (!coffee) {
      console.error("Café não encontrado com ID:", id)
      notFound()
    }

    const brews = await getBrewsByCoffeeId(id)
    console.log("Preparos encontrados:", brews)

    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/coffees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex-1" />
          <Link href={`/coffees/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <DeleteCoffeeButton id={id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{coffee.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Rating value={coffee.rating} readOnly size="sm" />
              <span className="text-sm text-muted-foreground">
                {coffee.rating.toFixed(1)} estrelas
              </span>
            </div>
            <p className="text-muted-foreground mb-6">{coffee.sensoryProfile}</p>

            <div className="space-y-4">
              <div>
                <h2 className="font-medium mb-1">Região</h2>
                <p className="text-muted-foreground">{coffee.region}</p>
              </div>
              <div>
                <h2 className="font-medium mb-1">Produtor</h2>
                <p className="text-muted-foreground">{coffee.producer}</p>
              </div>
              <div>
                <h2 className="font-medium mb-1">Variedade</h2>
                <p className="text-muted-foreground">{coffee.variety}</p>
              </div>
              <div>
                <h2 className="font-medium mb-1">Processo</h2>
                <p className="text-muted-foreground">{coffee.process}</p>
              </div>
              <div>
                <h2 className="font-medium mb-1">Altitude</h2>
                <p className="text-muted-foreground">{coffee.altitude}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Preparos</h2>
            </div>

            {brews.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-card">
                <p className="text-muted-foreground mb-4">Nenhum preparo registrado</p>
                <Link href={`/brews/new?coffeeId=${id}`}>
                  <Button>
                    Registrar preparo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {brews.map((brew) => (
                  <div key={brew.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{brew.brewingMethod}</h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(brew.brewDate)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Acidez:</span> {brew.acidity}/5
                      </div>
                      <div>
                        <span className="text-muted-foreground">Doçura:</span> {brew.sweetness}/5
                      </div>
                      <div>
                        <span className="text-muted-foreground">Corpo:</span> {brew.body}/5
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar página do café:", error)
    throw error
  }
}
//subir para o github
