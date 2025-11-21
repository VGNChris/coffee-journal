"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2, Coffee } from "lucide-react"
import { BookIcon } from "@/components/icons/book-icon"
import { Card } from "@/components/ui/card"
import { BrewForm } from "@/components/brew-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Brew, Coffee as CoffeeType } from "@/lib/types"
import { Rating } from "@/components/ui/rating"
import { deleteBrew } from "@/lib/actions"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

interface BrewListProps {
  initialBrews: Brew[]
  coffees: CoffeeType[]
}

export function BrewList({ initialBrews, coffees }: BrewListProps) {
  const [brews, setBrews] = useState<Brew[]>(initialBrews)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBrew, setEditingBrew] = useState<Brew | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este preparo?")) {
      return
    }

    try {
      const result = await deleteBrew(id)
      if (result.success) {
        setBrews(brews.filter(brew => brew.id !== id))
        toast.success("Preparo excluído com sucesso!")
      } else {
        throw new Error("Falha ao excluir preparo")
      }
    } catch (error) {
      console.error("Erro ao excluir preparo:", error)
      toast.error("Erro ao excluir preparo")
    }
  }

  const handleBrewSave = (updatedBrew: Brew) => {
    if (editingBrew) {
      // Atualização
      setBrews(brews.map(brew => 
        brew.id === updatedBrew.id ? updatedBrew : brew
      ))
    } else {
      // Criação
      setBrews([updatedBrew, ...brews])
    }
    setIsDialogOpen(false)
    setEditingBrew(null)
  }

  const filteredBrews = brews.filter(brew => 
    brew.coffee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brew.brewingMethod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBrew(null)
                setIsDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo preparo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBrew ? "Editar preparo" : "Novo preparo"}
              </DialogTitle>
              <DialogDescription>
                {editingBrew
                  ? "Edite os detalhes do seu preparo de café."
                  : "Registre um novo preparo de café."}
              </DialogDescription>
            </DialogHeader>
            <BrewForm
              brew={editingBrew}
              coffees={coffees}
              onSuccess={handleBrewSave}
            />
          </DialogContent>
        </Dialog>

        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar preparos..."
            className="w-full px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {brews.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-card">
          <BookIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum preparo registrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Comece registrando seu primeiro preparo de café.
          </p>
        </div>
      ) : filteredBrews.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-card">
          <p className="text-muted-foreground">
            Nenhum preparo encontrado para "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBrews.map((brew) => (
            <Card key={brew.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold">{brew.coffee?.name}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{brew.brewingMethod} • {formatDate(brew.brewDate)} às {brew.brewTime}</p>
                    <Rating value={brew.rating} readOnly size="sm" />
                  </div>
                </div>
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Dose</div>
                  <div>{brew.dose}g</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Água</div>
                  <div>{brew.waterAmount}ml</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Proporção</div>
                  <div>{brew.ratio}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Temperatura</div>
                  <div>{brew.waterTemperature}°C</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Moagem</div>
                  <div>Click {brew.grinderSetting}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Extração</div>
                  <div>{brew.extractionTime}s</div>
                </div>
              </div>

              {brew.notes && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">Notas</div>
                  <div className="text-sm">{brew.notes}</div>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Acidez</div>
                    <div>{brew.acidity}/10</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Doçura</div>
                    <div>{brew.sweetness}/10</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Corpo</div>
                    <div>{brew.body}/10</div>
                  </div>
                </div>
                <Link href={`/coffees/${brew.coffee?.id}`}>
                  <Button variant="outline" size="sm">
                    <Coffee className="mr-2 h-4 w-4" />
                    Ver café
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 