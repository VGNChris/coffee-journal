import { getCoffees, getBrewById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { notFound } from "next/navigation"
import { BrewForm } from "@/components/brew-form"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditBrewPage({ params }: { params: { id: string } }) {
  const brewId = Number.parseInt(params.id)
  
  if (isNaN(brewId)) {
    notFound()
  }

  const [brew, coffees] = await Promise.all([
    getBrewById(brewId),
    getCoffees()
  ])

  if (!brew || !coffees) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href={`/brews/${brew.id}`}>
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao preparo
          </Button>
        </Link>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Editar preparo</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Editando preparo de {brew.coffeeName}
        </p>
      </div>

      <div className="max-w-2xl">
        <BrewForm coffees={coffees} brew={brew} />
      </div>
    </div>
  )
}

