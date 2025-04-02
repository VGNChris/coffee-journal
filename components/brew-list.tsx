"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { BookIcon } from "@/components/icons/book-icon"
import { Card } from "@/components/ui/card"
import { BrewForm } from "@/components/brew-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Brew, Coffee } from "@/lib/types"
import { Rating } from "@/components/ui/rating"
import { deleteBrew } from "@/lib/actions"
import { toast } from "sonner"

interface BrewListProps {
  initialBrews: Brew[]
  coffees: Coffee[]
}

export function BrewList({ initialBrews, coffees }: BrewListProps) {
  const [brews, setBrews] = useState<Brew[]>(initialBrews)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBrew, setEditingBrew] = useState<Brew | null>(null)

  const filteredBrews = filterRating
    ? brews.filter((brew) => brew.rating >= filterRating)
    : brews

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteBrew(id)
      if (result.success) {
        setBrews(brews.filter(brew => brew.id !== id))
        toast("Preparo excluído com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao excluir preparo:", error)
      toast("Erro ao excluir preparo. Por favor, tente novamente.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Diário do barista</h1>
          <p className="text-muted-foreground mt-1">Seu Banco de Dados Sensorial: armazene métodos, métricas e impressões de cada extração. Compare, analise e eleve sua expertise de home barista.🔍📊</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Preparo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBrew ? "Editar Preparo" : "Adicionar Preparo"}</DialogTitle>
            </DialogHeader>
            <BrewForm 
              brew={editingBrew || undefined} 
              coffees={coffees}
              onSuccess={(brew) => {
                if (editingBrew) {
                  setBrews(brews.map(b => b.id === brew.id ? brew : b))
                } else {
                  setBrews([...brews, brew])
                }
                setIsDialogOpen(false)
                setEditingBrew(null)
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

      {brews.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <BookIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Sem preparos aqui</h3>
          <p className="text-muted-foreground mb-4">Adicione seu primeiro preparo para começar sua experiência</p>
          <Link href="/brews/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar preparo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBrews.map((brew) => (
            <Card key={brew.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{brew.brewingMethod}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingBrew(brew)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(brew.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <Rating value={brew.rating} readOnly size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Temperatura da Água:</span>
                  <p className="text-muted-foreground">{brew.waterTemperature}°C</p>
                </div>
                <div>
                  <span className="font-medium">Configuração do Moedor:</span>
                  <p className="text-muted-foreground">{brew.grinderSetting}</p>
                </div>
                <div>
                  <span className="font-medium">Tempo de Extração:</span>
                  <p className="text-muted-foreground">{brew.extractionTime}s</p>
                </div>
                <div>
                  <span className="font-medium">Acidez:</span>
                  <p className="text-muted-foreground">{brew.acidity}/10</p>
                </div>
                <div>
                  <span className="font-medium">Doçura:</span>
                  <p className="text-muted-foreground">{brew.sweetness}/10</p>
                </div>
                <div>
                  <span className="font-medium">Corpo:</span>
                  <p className="text-muted-foreground">{brew.body}/10</p>
                </div>
              </div>
              {brew.notes && (
                <div className="mt-4">
                  <span className="font-medium">Notas:</span>
                  <p className="text-sm text-muted-foreground mt-1">{brew.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 