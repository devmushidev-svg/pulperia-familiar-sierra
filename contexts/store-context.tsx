"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { db, type Product, type SaleWithItems } from "@/lib/database"

export type { Product } from "@/lib/database"

export type CartItem = {
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export type Sale = SaleWithItems

type StoreContextType = {
  products: Product[]
  sales: Sale[]
  isLoaded: boolean
  refreshProducts: () => void
  refreshSales: () => void
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addSale: (sale: { items: CartItem[]; subtotal: number; tax: number; total: number; date: string }) => Sale
  getSaleById: (id: string) => Sale | undefined
  getSchema: () => { tableName: string; columns: string[]; rowCount: number }[]
  executeQuery: (tableName: string) => Record<string, unknown>[]
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // SELECT * FROM productos
  const refreshProducts = useCallback(() => {
    const data = db.selectAllProducts()
    setProducts(data)
  }, [])

  // SELECT * FROM ventas con detalles
  const refreshSales = useCallback(() => {
    const data = db.selectAllSalesWithDetails()
    setSales(data)
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    db.init()
    refreshProducts()
    refreshSales()
    setIsLoaded(true)
  }, [refreshProducts, refreshSales])

  // INSERT INTO productos
  const addProduct = (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    db.insertProduct(product)
    refreshProducts()
  }

  // UPDATE productos SET ... WHERE id = ?
  const updateProduct = (product: Product) => {
    db.updateProduct(product.id, product)
    refreshProducts()
  }

  // DELETE FROM productos WHERE id = ?
  const deleteProduct = (id: string) => {
    db.deleteProduct(id)
    refreshProducts()
  }

  // INSERT INTO ventas + INSERT INTO detalle_ventas
  const addSale = (sale: { items: CartItem[]; subtotal: number; tax: number; total: number; date: string }) => {
    const newSale = db.insertSale(sale)
    refreshProducts() // Actualizar stock
    refreshSales()
    return newSale
  }

  // SELECT * FROM ventas WHERE id = ?
  const getSaleById = (id: string) => {
    return sales.find((s) => s.id === id)
  }

  // Obtener esquema de tablas (para mostrar en clase)
  const getSchema = () => {
    return db.getSchema()
  }

  // Ejecutar consulta SELECT (para mostrar en clase)
  const executeQuery = (tableName: string) => {
    return db.executeQuery(tableName)
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        isLoaded,
        refreshProducts,
        refreshSales,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        getSaleById,
        getSchema,
        executeQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
