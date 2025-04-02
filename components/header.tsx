"use client"

import Link from "next/link"
import { Coffee, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Coffee className="h-6 w-6" />
          <span className="font-bold text-lg">Diário do café</span>
        </Link>

        {/* Menu para desktop */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/coffees">
            <Button variant="ghost">Meus cafés</Button>
          </Link>
          <Link href="/brews">
            <Button variant="ghost">Diário do barista</Button>
          </Link>
          <ThemeToggle />
        </nav>

        {/* Menu para mobile */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
              <div className="flex flex-col space-y-4 py-4">
                <Link href="/coffees" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Meus cafés
                  </Button>
                </Link>
                <Link href="/brews" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Diário do barista
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

