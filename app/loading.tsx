import { Loader2 } from "lucide-react"

export default function LoadingPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        <p className="text-sm md:text-base text-muted-foreground mt-4">
          Carregando...
        </p>
      </div>
    </div>
  )
} 