"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
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

const initialProducts: Product[] = [
  { id: "1", name: "Coca-Cola 600ml", category: "Bebidas", price: 25, stock: 48, minStock: 20 },
  { id: "2", name: "Pepsi 600ml", category: "Bebidas", price: 23, stock: 36, minStock: 20 },
  { id: "3", name: "Agua Azul 500ml", category: "Bebidas", price: 15, stock: 60, minStock: 24 },
  { id: "4", name: "Leche Sula 1L", category: "Lácteos", price: 42, stock: 24, minStock: 12 },
  { id: "5", name: "Leche Dos Pinos 1L", category: "Lácteos", price: 45, stock: 18, minStock: 12 },
  { id: "6", name: "Queso Crema Sula", category: "Lácteos", price: 38, stock: 15, minStock: 8 },
  { id: "7", name: "Arroz Tío Pelón 1kg", category: "Abarrotes", price: 28, stock: 40, minStock: 15 },
  { id: "8", name: "Frijoles Don Pedro 1kg", category: "Abarrotes", price: 35, stock: 32, minStock: 15 },
  { id: "9", name: "Azúcar Caña Real 1kg", category: "Abarrotes", price: 22, stock: 45, minStock: 20 },
  { id: "10", name: "Aceite Mazola 750ml", category: "Abarrotes", price: 65, stock: 20, minStock: 10 },
  { id: "11", name: "Pan Bimbo Blanco", category: "Panadería", price: 48, stock: 12, minStock: 6 },
  { id: "12", name: "Tortillas de Maíz (12)", category: "Panadería", price: 18, stock: 25, minStock: 10 },
  { id: "13", name: "Huevos (Docena)", category: "Huevos", price: 85, stock: 30, minStock: 15 },
  { id: "14", name: "Jabón Xtra 1kg", category: "Limpieza", price: 55, stock: 18, minStock: 8 },
  { id: "15", name: "Papel Higiénico Scott (4)", category: "Limpieza", price: 45, stock: 22, minStock: 10 },
]

type StoreContextType = {
  products: Product[]
  sales: Sale[]
  isLoaded: boolean
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  updateStock: (productId: string, quantity: number) => void
  addSale: (sale: Omit<Sale, "id">) => Sale
  getSaleById: (id: string) => Sale | undefined
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts, productsLoaded] = useLocalStorage<Product[]>("pulperia-products", initialProducts)
  const [sales, setSales, salesLoaded] = useLocalStorage<Sale[]>("pulperia-sales", [])

  const isLoaded = productsLoaded && salesLoaded

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const updateStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - quantity } : p))
    )
  }

  const addSale = (sale: Omit<Sale, "id">) => {
    const newSale: Sale = {
      ...sale,
      id: `V-${Date.now().toString().slice(-6)}`,
    }
    setSales((prev) => [newSale, ...prev])
    
    // Actualizar stock de productos
    sale.items.forEach((item) => {
      updateStock(item.productId, item.quantity)
    })
    
    return newSale
  }

  const getSaleById = (id: string) => {
    return sales.find((s) => s.id === id)
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
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
