"use client"

import { useState, useEffect } from "react"
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
import { Plus } from "lucide-react"
import type { Product } from "@/app/(dashboard)/ventas/page"

type POSFormProps = {
  products: Product[]
  onAddToCart: (productId: string, quantity: number) => void
}

export function POSForm({ products, onAddToCart }: POSFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [price, setPrice] = useState<number>(0)
  const [subtotal, setSubtotal] = useState<number>(0)

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct)
    if (product) {
      setPrice(product.price)
      setSubtotal(product.price * parseInt(quantity || "0", 10))
    } else {
      setPrice(0)
      setSubtotal(0)
    }
  }, [selectedProduct, quantity, products])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProduct && parseInt(quantity, 10) > 0) {
      onAddToCart(selectedProduct, parseInt(quantity, 10))
      setSelectedProduct("")
      setQuantity("1")
    }
  }

  const selectedProductData = products.find((p) => p.id === selectedProduct)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Seleccionar Producto</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product">Producto</Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger id="product">
              <SelectValue placeholder="Buscar producto..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex items-center justify-between gap-4">
                    <span>{product.name}</span>
                    <span className="text-muted-foreground">L {product.price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            max={selectedProductData?.stock || 999}
            required
          />
          {selectedProductData && (
            <p className="text-xs text-muted-foreground">
              Stock disponible: {selectedProductData.stock} unidades
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Precio Unitario</Label>
          <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
            L {price.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subtotal</Label>
          <div className="flex h-9 items-center rounded-md border border-primary/20 bg-primary/5 px-3 text-sm font-semibold text-primary">
            L {subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!selectedProduct || parseInt(quantity, 10) <= 0}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar al Carrito
        </Button>
      </form>
    </div>
  )
}
