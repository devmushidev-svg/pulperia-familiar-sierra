"use client"

/**
 * Contexto global de la tienda (productos y ventas).
 *
 * Proceso: Al montar, carga productos y ventas desde Supabase. Expone operaciones
 * CRUD async que persisten en la nube y refrescan el estado. addSale actualiza
 * el stock de productos vendidos.
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
  error: string | null
  refreshProducts: () => Promise<void>
  refreshSales: () => Promise<void>
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addSale: (sale: { items: CartItem[]; subtotal: number; tax: number; total: number; date: string }) => Promise<Sale>
  getSaleById: (id: string) => Sale | undefined
  getSchema: () => Promise<{ tableName: string; columns: string[]; rowCount: number }[]>
  executeQuery: (tableName: string) => Promise<Record<string, unknown>[]>
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshProducts = useCallback(async () => {
    try {
      setError(null)
      const data = await db.selectAllProducts()
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando productos")
      setProducts([])
    }
  }, [])

  const refreshSales = useCallback(async () => {
    try {
      setError(null)
      const data = await db.selectAllSalesWithDetails()
      setSales(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando ventas")
      setSales([])
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        await db.init()
        await refreshProducts()
        await refreshSales()
        if (!cancelled) setIsLoaded(true)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error conectando con la base de datos")
          setIsLoaded(true)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshProducts, refreshSales])

  const addProduct = useCallback(
    async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      await db.insertProduct(product)
      await refreshProducts()
    },
    [refreshProducts]
  )

  const updateProduct = useCallback(
    async (product: Product) => {
      await db.updateProduct(product.id, product)
      await refreshProducts()
    },
    [refreshProducts]
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      await db.deleteProduct(id)
      await refreshProducts()
    },
    [refreshProducts]
  )

  const addSale = useCallback(
    async (sale: { items: CartItem[]; subtotal: number; tax: number; total: number; date: string }) => {
      const newSale = await db.insertSale(sale)
      await refreshProducts()
      await refreshSales()
      return newSale
    },
    [refreshProducts, refreshSales]
  )

  const getSaleById = useCallback(
    (id: string) => {
      return sales.find((s) => s.id === id)
    },
    [sales]
  )

  const getSchema = useCallback(async () => {
    return await db.getSchema()
  }, [])

  const executeQuery = useCallback(async (tableName: string) => {
    return await db.executeQuery(tableName)
  }, [])

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        isLoaded,
        error,
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
