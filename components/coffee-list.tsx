"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import Link from "next/link"
import { Coffee, Plus, Edit, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CoffeeForm } from "@/components/coffee-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Coffee as CoffeeType } from "@/lib/types"
import { Rating } from "@/components/ui/rating"
import { deleteCoffee } from "@/lib/actions"
import { toast } from "sonner"

interface CoffeeListProps {
  initialCoffees: CoffeeType[]
}

export function CoffeeList({ initialCoffees }: CoffeeListProps) {
  const [coffees, setCoffees] = useState<CoffeeType[]>(initialCoffees)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoffee, setEditingCoffee] = useState<CoffeeType | null>(null)

  const filteredCoffees = filterRating
    ? coffees.filter((coffee) => coffee.rating >= filterRating)
    : coffees

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteCoffee(id)
      if (result.success) {
        setCoffees(coffees.filter(coffee => coffee.id !== id))
        toast("Café excluído com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao excluir café:", error)
      toast("Erro ao excluir café. Por favor, tente novamente.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Meus cafés</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Gerencie sua coleção de cafés</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar café
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCoffee ? "Editar Café" : "Adicionar Café"}</DialogTitle>
            </DialogHeader>
            <CoffeeForm 
              coffee={editingCoffee || undefined} 
              onSuccess={(coffee) => {
                if (editingCoffee) {
                  setCoffees(coffees.map(c => c.id === coffee.id ? coffee : c))
                } else {
                  setCoffees([...coffees, coffee])
                }
                setIsDialogOpen(false)
                setEditingCoffee(null)
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filtrar por Classificação</h2>
        <div className="flex gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
            >
              {rating}★
            </Button>
          ))}
        </div>
      </div>

      {coffees.length === 0 ? (
        <div className="text-center py-8 md:py-12 border rounded-lg bg-card">
          <Coffee className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg md:text-xl font-medium mb-2">Sem cafés aqui</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">Adicione seu primeiro café para começar</p>
          <Link href="/coffees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4"/> Adicionar café
=======
import { Input } from "@/components/ui/input"
import { CoffeeCard } from "@/components/coffee-card"
import { Rating } from "@/components/ui/rating"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Coffee } from "@/lib/types"

interface CoffeeListProps {
  coffees: Coffee[]
}

export function CoffeeList({ coffees }: CoffeeListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState(0)

  const filteredCoffees = coffees.filter((coffee) => {
    const matchesSearch = 
      coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.process.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === 0 || coffee.rating >= filterRating
    
    return matchesSearch && matchesRating
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Meus cafés</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Registre e acompanhe seus cafés especiais
          </p>
        </div>
        <Link href="/coffees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar café
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome, região, produtor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrar por classificação:</span>
          <Rating
            value={filterRating}
            onChange={setFilterRating}
            size="sm"
            readOnly={false}
          />
          {filterRating > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterRating(0)}
              className="h-8 px-2"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {filteredCoffees.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <h3 className="text-xl font-medium mb-2">Nenhum café encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterRating > 0
              ? "Tente ajustar sua busca ou filtro"
              : "Adicione seu primeiro café para começar"}
          </p>
          <Link href="/coffees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar café
>>>>>>> ae0d77a (FIX ERROS)
            </Button>
          </Link>
        </div>
      ) : (
<<<<<<< HEAD
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCoffees.map((coffee) => (
            <Card key={coffee.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{coffee.name}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCoffee(coffee)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(coffee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <Rating value={coffee.rating} readOnly size="sm" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">{coffee.sensoryProfile}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Região:</span>
                  <p className="text-muted-foreground">{coffee.region}</p>
                </div>
                <div>
                  <span className="font-medium">Produtor:</span>
                  <p className="text-muted-foreground">{coffee.producer}</p>
                </div>
                <div>
                  <span className="font-medium">Variedade:</span>
                  <p className="text-muted-foreground">{coffee.variety}</p>
                </div>
                <div>
                  <span className="font-medium">Processo:</span>
                  <p className="text-muted-foreground">{coffee.process}</p>
                </div>
                <div>
                  <span className="font-medium">Altitude:</span>
                  <p className="text-muted-foreground">{coffee.altitude}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
=======
        <>
          {filterRating > 0 && (
            <span className="text-sm text-muted-foreground">
              Mostrando {filteredCoffees.length} de {coffees.length} cafés
            </span>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoffees.map((coffee) => (
              <CoffeeCard key={coffee.id} coffee={coffee} />
            ))}
          </div>
        </>
>>>>>>> ae0d77a (FIX ERROS)
      )}
    </div>
  )
} 