"use client"

import { useState } from "react"
import { POSForm } from "@/components/sales/pos-form"
import { ShoppingCart } from "@/components/sales/shopping-cart"
import { SaleSummary } from "@/components/sales/sale-summary"
import { SalesHistory } from "@/components/sales/sales-history"
import { InvoiceModal } from "@/components/sales/invoice-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart as ShoppingCartIcon } from "lucide-react"

export type Product = {
  id: string
  name: string
  price: number
  stock: number
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

const products: Product[] = [
  { id: "P001", name: "Coca-Cola 600ml", price: 25, stock: 100 },
  { id: "P002", name: "Leche Dos Pinos 1L", price: 42, stock: 50 },
  { id: "P003", name: "Arroz Tío Pelón 1kg", price: 28, stock: 80 },
  { id: "P004", name: "Pan Bimbo Blanco", price: 55, stock: 30 },
  { id: "P005", name: "Huevos Docena", price: 85, stock: 25 },
  { id: "P006", name: "Frijoles Negros 1kg", price: 35, stock: 60 },
  { id: "P007", name: "Aceite Vegetal 1L", price: 78, stock: 40 },
  { id: "P008", name: "Café Britt 250g", price: 95, stock: 20 },
  { id: "P009", name: "Azúcar 1kg", price: 22, stock: 70 },
  { id: "P010", name: "Mantequilla 250g", price: 48, stock: 35 },
]

const initialSales: Sale[] = [
  {
    id: "F001",
    items: [
      { productId: "P001", productName: "Coca-Cola 600ml", quantity: 3, price: 25, subtotal: 75 },
      { productId: "P004", productName: "Pan Bimbo Blanco", quantity: 1, price: 55, subtotal: 55 },
    ],
    subtotal: 130,
    tax: 19.50,
    total: 149.50,
    date: "09/03/2026 14:32",
  },
  {
    id: "F002",
    items: [
      { productId: "P002", productName: "Leche Dos Pinos 1L", quantity: 2, price: 42, subtotal: 84 },
      { productId: "P005", productName: "Huevos Docena", quantity: 1, price: 85, subtotal: 85 },
    ],
    subtotal: 169,
    tax: 25.35,
    total: 194.35,
    date: "09/03/2026 13:15",
  },
  {
    id: "F003",
    items: [
      { productId: "P003", productName: "Arroz Tío Pelón 1kg", quantity: 2, price: 28, subtotal: 56 },
      { productId: "P006", productName: "Frijoles Negros 1kg", quantity: 2, price: 35, subtotal: 70 },
      { productId: "P007", productName: "Aceite Vegetal 1L", quantity: 1, price: 78, subtotal: 78 },
    ],
    subtotal: 204,
    tax: 30.60,
    total: 234.60,
    date: "09/03/2026 12:48",
  },
]

export default function VentasPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<Sale | null>(null)
  const [saleCounter, setSaleCounter] = useState(initialSales.length + 1)

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.15 // ISV 15%
  const total = subtotal + tax

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = cart.find((item) => item.productId === productId)
    
    if (existingItem) {
      setCart(cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + quantity,
              subtotal: (item.quantity + quantity) * item.price,
            }
          : item
      ))
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        subtotal: product.price * quantity,
      }
      setCart([...cart, newItem])
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setCart(cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ))
  }

  const handleCancelSale = () => {
    setCart([])
  }

  const handleFinalizeSale = () => {
    if (cart.length === 0) return

    const newSale: Sale = {
      id: `F${String(saleCounter).padStart(3, "0")}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      date: new Date().toLocaleString("es-HN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setSales([newSale, ...sales])
    setSaleCounter(saleCounter + 1)
    setCurrentInvoice(newSale)
    setInvoiceModalOpen(true)
    setCart([])
  }

  const handleViewInvoice = (sale: Sale) => {
    setCurrentInvoice(sale)
    setInvoiceModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* POS Section */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <ShoppingCartIcon className="h-5 w-5 text-primary" />
            Punto de Venta
          </CardTitle>
          <CardDescription>Registra ventas agregando productos al carrito</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Product Selection */}
            <div className="lg:col-span-1">
              <POSForm products={products} onAddToCart={handleAddToCart} />
            </div>

            {/* Center: Shopping Cart */}
            <div className="lg:col-span-1">
              <ShoppingCart
                items={cart}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>

            {/* Right: Summary & Actions */}
            <div className="lg:col-span-1">
              <SaleSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                hasItems={cart.length > 0}
                onFinalize={handleFinalizeSale}
                onCancel={handleCancelSale}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales History */}
      <SalesHistory sales={sales} onViewInvoice={handleViewInvoice} />

      {/* Invoice Modal */}
      <InvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
        sale={currentInvoice}
      />
    </div>
  )
}
