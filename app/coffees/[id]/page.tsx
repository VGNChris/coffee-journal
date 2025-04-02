import { getCoffeeById, getBrewsByCoffeeId } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { BookIcon } from "@/components/icons/book-icon"
import { notFound, redirect } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { deleteCoffee } from "@/lib/actions"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CoffeeDetailPage({ params }: { params: { id: string } }) {
  const coffeeId = Number.parseInt(params.id)
  
  if (isNaN(coffeeId)) {
    notFound()
  }

  const coffee = await getCoffeeById(coffeeId)

  if (!coffee) {
    notFound()
  }

  const recentBrews = await getBrewsByCoffeeId(coffeeId)

  // Log para depuração
  console.log("Exibindo café:", coffee)
  console.log("Perfil sensorial:", coffee.sensoryProfile)
  console.log("Preparos recentes:", recentBrews)

  async function deleteCoffeeAction() {
    'use server'
    
    try {
      const result = await deleteCoffee(coffeeId)
      redirect(result.redirect)
    } catch (error) {
      console.error("Erro ao deletar café:", error)
      throw new Error("Falha ao deletar café")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href="/coffees">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao diário do café
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{coffee.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Link href={`/coffees/${coffee.id}/edit`}>
            <Button variant="outline" size="sm" className="h-9">
              <Edit className="mr-2 h-4 w-4" /> Editar café
            </Button>
          </Link>
          <form action={deleteCoffeeAction}>
            <Button variant="destructive" size="sm" className="h-9">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir café
            </Button>
          </form>
          <Link href={`/brews/new?coffeeId=${coffee.id}`}>
            <Button size="sm" className="h-9">
              <BookIcon className="mr-2 h-4 w-4" /> Adicionar preparo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-card border rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Detalhes do café</h2>
          <dl className="space-y-3 md:space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Perfil sensorial</dt>
              <dd className="mt-1">{coffee.sensoryProfile || "Não especificado"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Região</dt>
              <dd className="mt-1">{coffee.region}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Produtor</dt>
              <dd className="mt-1">{coffee.producer}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Variedade</dt>
              <dd className="mt-1">{coffee.variety}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Processo</dt>
              <dd className="mt-1">{coffee.process}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Altitude</dt>
              <dd className="mt-1">{coffee.altitude}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card border rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Preparos recentes</h2>
          
          {recentBrews.length === 0 ? (
            <>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Sem preparos recentes para esse café.
              </p>
              <Link href={`/brews/new?coffeeId=${coffee.id}`}>
                <Button className="w-full">
                  <BookIcon className="mr-2 h-4 w-4" /> Adicionar preparo
                </Button>
              </Link>
            </>
          ) : (
            <div className="space-y-4">
              {recentBrews.map((brew) => (
                <div key={brew.id} className="border rounded-md p-3 md:p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div>
                      <h3 className="font-medium">{brew.brewingMethod}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(brew.createdAt)}</p>
                    </div>
                    <div className="flex space-x-2 sm:space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-bold">{brew.acidity}</div>
                        <div className="text-xs text-muted-foreground">Acidez</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold">{brew.sweetness}</div>
                        <div className="text-xs text-muted-foreground">Doçura</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold">{brew.body}</div>
                        <div className="text-xs text-muted-foreground">Corpo</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="font-medium">Temperatura:</span>
                      <span className="text-muted-foreground ml-1">{brew.waterTemperature}°C</span>
                    </div>
                    <div>
                      <span className="font-medium">Click:</span>
                      <span className="text-muted-foreground ml-1">{brew.grinderSetting}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tempo:</span>
                      <span className="text-muted-foreground ml-1">{brew.extractionTime}s</span>
                    </div>
                  </div>
                  <Link href={`/brews/${brew.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              ))}
              
              <Link href={`/brews/new?coffeeId=${coffee.id}`}>
                <Button className="w-full">
                  <BookIcon className="mr-2 h-4 w-4" /> Adicionar outro preparo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}