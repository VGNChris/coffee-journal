"use client"

import { useState } from "react"
import Link from "next/link"
import { Coffee, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Rating } from "@/components/ui/rating"
import type { Coffee as CoffeeType } from "@/lib/types"

interface CoffeeListProps {
  coffees: CoffeeType[]
}

export function CoffeeList({ coffees }: CoffeeListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState(0)

  const filteredCoffees = coffees.filter((coffee) => {
    const matchesSearch = coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.process.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = filterRating === 0 || coffee.rating >= filterRating

    return matchesSearch && matchesRating
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Meus cafés</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Gerencie sua coleção de cafés especiais
          </p>
        </div>
        <Link href="/coffees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo café
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cafés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Filtrar por avaliação:</span>
          <Rating
            value={filterRating}
            onChange={setFilterRating}
            size="sm"
          />
        </div>
      </div>

      {filteredCoffees.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Coffee className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Nenhum café encontrado</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterRating > 0
                ? "Tente ajustar seus filtros de busca"
                : "Comece adicionando seu primeiro café"}
            </p>
            <Link href="/coffees/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Adicionar café
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoffees.map((coffee) => (
            <Link key={coffee.id} href={`/coffees/${coffee.id}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold mb-1">{coffee.name}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {coffee.sensoryProfile}
                      </p>
                    </div>
                    <Rating value={coffee.rating} readOnly size="sm" />
                  </div>
                  <div className="text-sm">
                    <p><span className="text-muted-foreground">Região:</span> {coffee.region}</p>
                    <p><span className="text-muted-foreground">Produtor:</span> {coffee.producer}</p>
                    <p><span className="text-muted-foreground">Variedade:</span> {coffee.variety}</p>
                    <p><span className="text-muted-foreground">Processo:</span> {coffee.process}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
