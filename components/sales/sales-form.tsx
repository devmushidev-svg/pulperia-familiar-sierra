"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ShoppingCart } from "lucide-react"

type Product = {
  id: string
  name: string
  price: number
}

type SalesFormProps = {
  products: Product[]
  onSubmit: (productId: string, quantity: number) => void
}

export function SalesForm({ products, onSubmit }: SalesFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [price, setPrice] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct)
    if (product) {
      setPrice(product.price)
      setTotal(product.price * parseInt(quantity || "0", 10))
    } else {
      setPrice(0)
      setTotal(0)
    }
  }, [selectedProduct, quantity, products])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProduct && parseInt(quantity, 10) > 0) {
      onSubmit(selectedProduct, parseInt(quantity, 10))
      setSelectedProduct("")
      setQuantity("1")
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Registrar Venta
        </CardTitle>
        <CardDescription>Selecciona un producto y cantidad para registrar una nueva venta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="product">Producto</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Precio Unitario</Label>
            <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
              L {price.toLocaleString()}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Total</Label>
            <div className="flex h-9 items-center rounded-md border border-primary/20 bg-primary/5 px-3 text-sm font-semibold text-primary">
              L {total.toLocaleString()}
            </div>
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-5">
            <Button type="submit" className="w-full sm:w-auto" disabled={!selectedProduct}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Registrar Venta
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
