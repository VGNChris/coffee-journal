import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  )
} 