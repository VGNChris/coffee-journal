import { getCoffeeById, getBrewsByCoffeeId } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, CoffeeIcon as CoffeeBeaker, Trash2 } from 'lucide-react'
import { notFound, redirect } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { deleteCoffee } from "@/lib/actions"

export default async function CoffeeDetailPage({ params }: { params: { id: string } }) {
  const coffeeId = Number.parseInt(params.id);
  const coffee = await getCoffeeById(coffeeId);
  const recentBrews = await getBrewsByCoffeeId(coffeeId);

  if (!coffee) {
    notFound()
  }

  // Log para depuração
  console.log("Exibindo café:", coffee)
  console.log("Perfil sensorial:", coffee.sensoryProfile)
  console.log("Preparos recentes:", recentBrews)

  async function deleteCoffeeAction() {
    'use server'
    if (!coffee) return
    const result = await deleteCoffee(coffee.id)
    redirect(result.redirect)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/coffees">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao diário do café
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">{coffee.name}</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/coffees/${coffee.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Editar café
            </Button>
          </Link>
          <form action={deleteCoffeeAction}>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir café
            </Button>
          </form>
          <Link href={`/brews/new?coffeeId=${coffee.id}`}>
            <Button>
              <CoffeeBeaker className="mr-2 h-4 w-4" /> Adicionar preparo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Detalhes do café</h2>
          <dl className="space-y-4">
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

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Preparos recentes</h2>
          
          {recentBrews.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-4">Sem preparos recentes para esse café.</p>
              <div className="mt-4">
                <Link href={`/brews/new?coffeeId=${coffee.id}`}>
                  <Button>
                    <CoffeeBeaker className="mr-2 h-4 w-4" /> Adicionar preparo
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {recentBrews.map((brew) => (
                <div key={brew.id} className="border rounded-md p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{brew.brewingMethod}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(brew.createdAt)}</p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="text-center px-2">
                        <div className="text-sm font-bold">{brew.acidity}</div>
                        <div className="text-xs text-muted-foreground">Acidez</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-sm font-bold">{brew.sweetness}</div>
                        <div className="text-xs text-muted-foreground">Doçura</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-sm font-bold">{brew.body}</div>
                        <div className="text-xs text-muted-foreground">Corpo</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Temperatura da água:</span>
                      <span className="text-muted-foreground ml-1">{brew.waterTemperature}°C</span>
                    </div>
                    <div>
                      <span className="font-medium">Click do moedor:</span>
                      <span className="text-muted-foreground ml-1">{brew.grinderSetting}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tempo de extração (s):</span>
                      <span className="text-muted-foreground ml-1">{brew.extractionTime}s</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link href={`/brews/${brew.id}`}>
                      <Button variant="outline" size="sm" className="w-full">Ver detalhes</Button>
                    </Link>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <Link href={`/brews/new?coffeeId=${coffee.id}`}>
                  <Button className="w-full">
                    <CoffeeBeaker className="mr-2 h-4 w-4" /> Adicionar outro preparo
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}