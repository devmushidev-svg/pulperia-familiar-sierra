"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/app/(dashboard)/productos/page"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Omit<Product, "id">) => void
}

const categories = ["Bebidas", "Lácteos", "Abarrotes", "Panadería", "Limpieza", "Snacks"]

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  useEffect(() => {
    if (product) {
      setName(product.name)
      setCategory(product.category)
      setPrice(String(product.price))
      setStock(String(product.stock))
    } else {
      setName("")
      setCategory("")
      setPrice("")
      setStock("")
    }
  }, [product, open])

  const getStatus = (stockValue: number): Product["status"] => {
    if (stockValue === 0) return "agotado"
    if (stockValue <= 5) return "bajo_stock"
    return "disponible"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stockValue = parseInt(stock, 10)
    onSave({
      name,
      category,
      price: parseInt(price, 10),
      stock: stockValue,
      status: getStatus(stockValue),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Modifica los datos del producto y guarda los cambios."
              : "Completa los datos para agregar un nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Coca-Cola 600ml"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio (₡)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{product ? "Guardar Cambios" : "Agregar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
