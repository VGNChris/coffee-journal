import { getCoffeeById } from "@/lib/data"
import { CoffeeForm } from "@/components/coffee-form"
import { notFound } from "next/navigation"

export default async function EditCoffeePage({ params }: { params: { id: string } }) {
  const coffee = await getCoffeeById(Number.parseInt(params.id))

  if (!coffee) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Editar café</h1>
      <CoffeeForm coffee={coffee} />
    </div>
  )
}

