"use client"

import { useState } from "react"
import { SalesForm } from "@/components/sales/sales-form"
import { SalesTable } from "@/components/sales/sales-table"

export type Sale = {
  id: string
  product: string
  quantity: number
  price: number
  total: number
  date: string
}

const products = [
  { id: "P001", name: "Coca-Cola 600ml", price: 850 },
  { id: "P002", name: "Leche Dos Pinos 1L", price: 1200 },
  { id: "P003", name: "Arroz Tío Pelón 1kg", price: 1500 },
  { id: "P004", name: "Pan Bimbo Blanco", price: 1800 },
  { id: "P005", name: "Huevos Docena", price: 2800 },
  { id: "P006", name: "Frijoles Negros 1kg", price: 1350 },
  { id: "P007", name: "Aceite Vegetal 1L", price: 2200 },
  { id: "P008", name: "Café Britt 250g", price: 3500 },
]

const initialSales: Sale[] = [
  { id: "V001", product: "Coca-Cola 600ml", quantity: 3, price: 850, total: 2550, date: "09/03/2026 14:32" },
  { id: "V002", product: "Leche Dos Pinos 1L", quantity: 2, price: 1200, total: 2400, date: "09/03/2026 14:15" },
  { id: "V003", product: "Arroz Tío Pelón 1kg", quantity: 1, price: 1500, total: 1500, date: "09/03/2026 13:48" },
  { id: "V004", product: "Pan Bimbo Blanco", quantity: 2, price: 1800, total: 3600, date: "09/03/2026 13:22" },
  { id: "V005", product: "Huevos Docena", quantity: 1, price: 2800, total: 2800, date: "09/03/2026 12:55" },
]

export default function VentasPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales)

  const handleAddSale = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const newSale: Sale = {
      id: `V${String(sales.length + 1).padStart(3, "0")}`,
      product: product.name,
      quantity,
      price: product.price,
      total: product.price * quantity,
      date: new Date().toLocaleString("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setSales([newSale, ...sales])
  }

  return (
    <div className="flex flex-col gap-6">
      <SalesForm products={products} onSubmit={handleAddSale} />
      <SalesTable sales={sales} />
    </div>
  )
}
