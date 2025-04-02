import { getBrewById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, Coffee, Trash2 } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { deleteBrew } from "@/lib/actions"

export default async function BrewDetailPage({ params }: { params: { id: string } }) {
  const brew = await getBrewById(Number.parseInt(params.id))

  if (!brew) {
    notFound()
  }

  async function deleteBrewAction() {
    'use server'
    if (!brew) return
    const result = await deleteBrew(brew.id)
    redirect(result.redirect)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/brews">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao diário do barista
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{brew.coffee.name}</h1>
          <p className="text-muted-foreground mt-1">
            {brew.brewingMethod} • {formatDate(brew.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href={`/brews/${brew.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Editar preparo
            </Button>
          </Link>
          <form action={deleteBrewAction}>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir preparo
            </Button>
          </form>
          <Link href={`/coffees/${brew.coffee.id}`}>
            <Button variant="secondary">
              <Coffee className="mr-2 h-4 w-4" /> Ver café
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Parâmetro do preparo</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Método de preparo</dt>
              <dd className="mt-1">{brew.brewingMethod}</dd>
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
              <dd className="mt-1">{brew.extractionTime} segundos</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notas no paladar</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{brew.acidity}</div>
              <div className="text-sm text-muted-foreground">Acidez</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{brew.sweetness}</div>
              <div className="text-sm text-muted-foreground">Doçura</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{brew.body}</div>
              <div className="text-sm text-muted-foreground">Corpo</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Detalhes do café</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="inline font-medium">Perfil sensorial:</dt>
                <dd className="inline ml-1">{brew.coffee.sensoryProfile}</dd>
              </div>
              <div>
                <dt className="inline font-medium">Região:</dt>
                <dd className="inline ml-1">{brew.coffee.region}</dd>
              </div>
              <div>
                <dt className="inline font-medium">Processo:</dt>
                <dd className="inline ml-1">{brew.coffee.process}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

