import { getBrewById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, Coffee, Trash2 } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { deleteBrew } from "@/lib/actions"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BrewDetailPage({ params }: { params: { id: string } }) {
  const brewId = Number.parseInt(params.id)
  
  if (isNaN(brewId)) {
    notFound()
  }

  const brew = await getBrewById(brewId)

  if (!brew) {
    notFound()
  }

  async function deleteBrewAction() {
    'use server'
    
    try {
      const result = await deleteBrew(brewId)
      redirect(result.redirect)
    } catch (error) {
      console.error("Erro ao deletar preparo:", error)
      throw new Error("Falha ao deletar preparo")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href={`/coffees/${brew.coffeeId}`}>
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao café
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{brew.brewingMethod}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Preparo de {brew.coffeeName} em {formatDate(brew.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/brews/${brew.id}/edit`}>
            <Button variant="outline" size="sm" className="h-9">
              <Edit className="mr-2 h-4 w-4" /> Editar preparo
            </Button>
          </Link>
          <form action={deleteBrewAction}>
            <Button variant="destructive" size="sm" className="h-9">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir preparo
            </Button>
          </form>
          <Link href={`/coffees/${brew.coffee.id}`}>
            <Button variant="secondary" size="sm" className="h-9">
              <Coffee className="mr-2 h-4 w-4" /> Ver café
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-card border rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Detalhes do preparo</h2>
          <dl className="space-y-3 md:space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Método</dt>
              <dd className="mt-1">{brew.brewingMethod}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Dose de café</dt>
              <dd className="mt-1">{brew.dose}g</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Água</dt>
              <dd className="mt-1">{brew.waterAmount}ml</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Temperatura da água</dt>
              <dd className="mt-1">{brew.waterTemperature}°C</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Click do moedor</dt>
              <dd className="mt-1">{brew.grinderSetting}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Tempo de extração</dt>
              <dd className="mt-1">{brew.extractionTime}s</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card border rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Avaliação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-background border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">{brew.acidity}</div>
              <div className="text-sm text-muted-foreground">Acidez</div>
            </div>
            <div className="bg-background border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">{brew.sweetness}</div>
              <div className="text-sm text-muted-foreground">Doçura</div>
            </div>
            <div className="bg-background border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">{brew.body}</div>
              <div className="text-sm text-muted-foreground">Corpo</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Notas</h3>
            <p className="text-sm md:text-base">{brew.notes || "Sem notas adicionadas"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

