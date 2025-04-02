"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteCoffeeButtonProps {
  id: number
}

export function DeleteCoffeeButton({ id }: DeleteCoffeeButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    try {
      const response = await fetch(`/api/coffees/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir café")
      }

      router.push("/coffees")
      router.refresh()
      toast.success("Café excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir café:", error)
      toast.error("Erro ao excluir café. Por favor, tente novamente.")
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 mr-2" />
      Excluir
    </Button>
  )
} 