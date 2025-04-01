import Link from "next/link"
import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Coffee className="h-6 w-6" />
          <span className="font-bold text-lg">Diário do café</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/coffees">
            <Button variant="ghost">Meus cafés</Button>
          </Link>
          <Link href="/brews">
            <Button variant="ghost">Diário do barista</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

