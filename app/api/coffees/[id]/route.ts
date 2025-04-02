import { deleteCoffee } from "@/lib/actions"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    await deleteCoffee(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar café:", error)
    return NextResponse.json(
      { error: "Erro ao deletar café" },
      { status: 500 }
    )
  }
} 