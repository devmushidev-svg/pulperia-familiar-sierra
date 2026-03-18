"use client"

/**
 * Diálogo crear/editar producto. Formulario con nombre, categoría, precio,
 * stock, stock_minimo. onSave persiste vía addProduct o updateProduct.
 */

import { useEffect, useState } from "react"
import type { Product } from "@/contexts/store-context"
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
  onSave: (product: Omit<Product, "id">) => void | Promise<void>
}

const categories = ["Bebidas", "Lácteos", "Abarrotes", "Panadería", "Aceites", "Limpieza", "Snacks", "Huevos", "Granos", "Higiene"]

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [nombre, setNombre] = useState("")
  const [categoria, setCategoria] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState("")
  const [stockMinimo, setStockMinimo] = useState("")

  useEffect(() => {
    if (product) {
      setNombre(product.nombre)
      setCategoria(product.categoria)
      setPrecio(String(product.precio))
      setStock(String(product.stock))
      setStockMinimo(String(product.stock_minimo))
    } else {
      setNombre("")
      setCategoria("")
      setPrecio("")
      setStock("")
      setStockMinimo("10")
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      nombre,
      categoria,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      stock_minimo: parseInt(stockMinimo, 10),
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
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Coca-Cola 600ml"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={categoria} onValueChange={setCategoria} required>
                <SelectTrigger id="categoria">
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
            <div className="grid gap-2">
              <Label htmlFor="precio">Precio (L)</Label>
              <Input
                id="precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Actual</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                <Input
                  id="stockMinimo"
                  type="number"
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(e.target.value)}
                  placeholder="10"
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
