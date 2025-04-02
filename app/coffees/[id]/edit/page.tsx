import { getCoffeeById } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { notFound } from "next/navigation"
import { CoffeeForm } from "@/components/coffee-form"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditCoffeePage({ params }: { params: { id: string } }) {
  const coffeeId = Number.parseInt(params.id)
  
  if (isNaN(coffeeId)) {
    notFound()
  }

  const coffee = await getCoffeeById(coffeeId)

  if (!coffee) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href={`/coffees/${coffee.id}`}>
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao café
          </Button>
        </Link>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Editar café</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Editando {coffee.name}
        </p>
      </div>

      <div className="max-w-2xl">
        <CoffeeForm coffee={coffee} />
      </div>
    </div>
  )
}

