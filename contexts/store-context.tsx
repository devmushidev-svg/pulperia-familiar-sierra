"use client"

/**
 * Contexto global de la tienda (productos y ventas).
 *
 * Proceso: Al montar, inicializa la base de datos e hidrata el estado con productos
 * y ventas desde localStorage. Expone operaciones CRUD que delegan en db y refrescan
 * el estado. addSale además actualiza el stock de productos vendidos.
 */

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

  const refreshProducts = useCallback(() => {
    const data = db.selectAllProducts()
    setProducts(data)
  }, [])

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

  const addProduct = (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    db.insertProduct(product)
    refreshProducts()
  }

  const updateProduct = (product: Product) => {
    db.updateProduct(product.id, product)
    refreshProducts()
  }

  const deleteProduct = (id: string) => {
    db.deleteProduct(id)
    refreshProducts()
  }

  const addSale = (sale: { items: CartItem[]; subtotal: number; tax: number; total: number; date: string }) => {
    const newSale = db.insertSale(sale)
    refreshProducts()
    refreshSales()
    return newSale
  }

  const getSaleById = (id: string) => {
    return sales.find((s) => s.id === id)
  }

  const getSchema = () => {
    return db.getSchema()
  }

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
