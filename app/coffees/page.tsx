import { getCoffees } from "@/lib/data"
import { CoffeeList } from "@/components/coffee-list"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CoffeesPage() {
  const coffees = await getCoffees()

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <CoffeeList coffees={coffees} />
    </div>
  )
}

