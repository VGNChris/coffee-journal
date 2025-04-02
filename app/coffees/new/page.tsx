import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { CoffeeForm } from "@/components/coffee-form"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function NewCoffeePage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4 md:mb-6">
        <Link href="/coffees">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao diário do café
          </Button>
        </Link>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Novo café</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Adicione um novo café ao seu diário
        </p>
      </div>

      <div className="max-w-2xl">
        <CoffeeForm />
      </div>
    </div>
  )
}

