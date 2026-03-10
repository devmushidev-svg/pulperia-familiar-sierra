"use client"

import { useState } from "react"
import { ProductsTable } from "@/components/products/products-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "disponible" | "bajo_stock" | "agotado"
}

const initialProducts: Product[] = [
  { id: "P001", name: "Coca-Cola 600ml", category: "Bebidas", price: 850, stock: 48, status: "disponible" },
  { id: "P002", name: "Leche Dos Pinos 1L", category: "Lácteos", price: 1200, stock: 24, status: "disponible" },
  { id: "P003", name: "Arroz Tío Pelón 1kg", category: "Abarrotes", price: 1500, stock: 5, status: "bajo_stock" },
  { id: "P004", name: "Pan Bimbo Blanco", category: "Panadería", price: 1800, stock: 12, status: "disponible" },
  { id: "P005", name: "Huevos Docena", category: "Lácteos", price: 2800, stock: 0, status: "agotado" },
  { id: "P006", name: "Frijoles Negros 1kg", category: "Abarrotes", price: 1350, stock: 18, status: "disponible" },
  { id: "P007", name: "Aceite Vegetal 1L", category: "Abarrotes", price: 2200, stock: 8, status: "disponible" },
  { id: "P008", name: "Café Britt 250g", category: "Abarrotes", price: 3500, stock: 3, status: "bajo_stock" },
]

export default function ProductosPage() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `P${String(products.length + 1).padStart(3, "0")}`,
    }
    setProducts([...products, newProduct])
    setDialogOpen(false)
  }

  const handleEditProduct = (product: Omit<Product, "id">) => {
    if (!editingProduct) return
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p
      )
    )
    setEditingProduct(null)
    setDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {isAdmin && (
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        )}
      </div>

      <ProductsTable
        products={filteredProducts}
        onEdit={openEditDialog}
        onDelete={handleDeleteProduct}
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
      />
    </div>
  )
}
