import { getBrews, getCoffees } from "@/lib/data"
import { BrewList } from "@/components/brew-list"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BrewsPage() {
  const [brews, coffees] = await Promise.all([
    getBrews(),
    getCoffees()
  ])

  return <BrewList initialBrews={brews} coffees={coffees} />
}

