import { getBrewById, getCoffees } from "@/lib/data"
import { BrewForm } from "@/components/brew-form"
import { notFound } from "next/navigation"

export default async function EditBrewPage({ params }: { params: { id: string } }) {
  const brew = await getBrewById(Number.parseInt(params.id))
  const coffees = await getCoffees()

  if (!brew) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Brew</h1>
      <BrewForm brew={brew} coffees={coffees} />
    </div>
  )
}

