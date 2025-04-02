"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Algo deu errado</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          Desculpe, ocorreu um erro ao processar sua solicitação.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
            </Button>
          </Link>
          <Button onClick={() => reset()}>Tentar novamente</Button>
        </div>
      </div>
    </div>
  )
} 