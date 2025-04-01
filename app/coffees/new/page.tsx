import { CoffeeForm } from "@/components/coffee-form"

export default function NewCoffeePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Adicionar novo café</h1>
      <CoffeeForm />
    </div>
  )
}

