"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type Product = {
  id: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  stock_minimo: number
}

export type CartItem = {
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export type Sale = {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  date: string
}

type StoreContextType = {
  products: Product[]
  sales: Sale[]
  isLoaded: boolean
  refreshProducts: () => Promise<void>
  refreshSales: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addSale: (sale: Omit<Sale, "id">) => Promise<Sale>
  getSaleById: (id: string) => Sale | undefined
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar productos desde la API (SQLite)
  const refreshProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/productos")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error al cargar productos:", error)
    }
  }, [])

  // Cargar ventas desde la API (SQLite)
  const refreshSales = useCallback(async () => {
    try {
      const response = await fetch("/api/ventas")
      if (response.ok) {
        const data = await response.json()
        setSales(data)
      }
    } catch (error) {
      console.error("Error al cargar ventas:", error)
    }
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([refreshProducts(), refreshSales()])
      setIsLoaded(true)
    }
    loadData()
  }, [refreshProducts, refreshSales])

  // Agregar producto
  const addProduct = async (product: Omit<Product, "id">) => {
    const id = Date.now().toString()
    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...product }),
      })
      if (response.ok) {
        await refreshProducts()
      }
    } catch (error) {
      console.error("Error al agregar producto:", error)
    }
  }

  // Actualizar producto
  const updateProduct = async (product: Product) => {
    try {
      const response = await fetch(`/api/productos/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (response.ok) {
        await refreshProducts()
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error)
    }
  }

  // Eliminar producto
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await refreshProducts()
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error)
    }
  }

  // Agregar venta
  const addSale = async (sale: Omit<Sale, "id">) => {
    const newSale: Sale = {
      ...sale,
      id: `V-${Date.now().toString().slice(-6)}`,
    }
    
    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      })
      if (response.ok) {
        await Promise.all([refreshProducts(), refreshSales()])
      }
    } catch (error) {
      console.error("Error al registrar venta:", error)
    }
    
    return newSale
  }

  // Obtener venta por ID
  const getSaleById = (id: string) => {
    return sales.find((s) => s.id === id)
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
