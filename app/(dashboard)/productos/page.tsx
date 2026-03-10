"use client"

import { useState } from "react"
import { ProductsTable } from "@/components/products/products-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useStore, type Product } from "@/contexts/store-context"
import { Spinner } from "@/components/ui/spinner"

export type { Product } from "@/contexts/store-context"

export default function ProductosPage() {
  const { isAdmin } = useAuth()
  const { products, isLoaded, addProduct, updateProduct, deleteProduct } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = (product: Omit<Product, "id">) => {
    addProduct(product)
    setDialogOpen(false)
  }

  const handleEditProduct = (product: Omit<Product, "id">) => {
    if (!editingProduct) return
    updateProduct({ ...product, id: editingProduct.id })
    setEditingProduct(null)
    setDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
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
