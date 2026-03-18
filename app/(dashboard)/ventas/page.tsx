"use client"

/**
 * Página de Ventas (Punto de Venta).
 *
 * Proceso: POSForm agrega productos al carrito. ShoppingCart permite editar cantidades.
 * SaleSummary muestra subtotal, ISV 15% y total. Al finalizar, addSale persiste la venta,
 * actualiza stock y abre InvoiceModal con la factura imprimible.
 */

import { useState } from "react"
import { POSForm } from "@/components/sales/pos-form"
import { ShoppingCart } from "@/components/sales/shopping-cart"
import { SaleSummary } from "@/components/sales/sale-summary"
import { SalesHistory } from "@/components/sales/sales-history"
import { InvoiceModal } from "@/components/sales/invoice-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart as ShoppingCartIcon } from "lucide-react"
import { useStore, type CartItem, type Sale } from "@/contexts/store-context"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export type { CartItem, Sale } from "@/contexts/store-context"
export type { Product } from "@/contexts/store-context"

export default function VentasPage() {
  const { products, sales, isLoaded, addSale } = useStore()
  const [cart, setCart] = useState<CartItem[]>([])
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<Sale | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.15
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
        productName: product.nombre,
        quantity,
        price: product.precio,
        subtotal: product.precio * quantity,
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

  const handleFinalizeSale = async () => {
    if (cart.length === 0) return

    setIsFinalizing(true)
    try {
      const newSale = await addSale({
        items: [...cart],
        subtotal,
        tax,
        total,
        date: new Date().toISOString(),
      })

      setCurrentInvoice(newSale)
      setInvoiceModalOpen(true)
      setCart([])
      toast.success("Venta registrada correctamente")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al registrar la venta"
      toast.error(msg)
      console.error("Error al registrar venta:", e)
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleViewInvoice = (sale: Sale) => {
    setCurrentInvoice(sale)
    setInvoiceModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
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
            <div className="lg:col-span-1">
              <POSForm products={products} onAddToCart={handleAddToCart} />
            </div>

            <div className="lg:col-span-1">
              <ShoppingCart
                items={cart}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>

            <div className="lg:col-span-1">
              <SaleSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                hasItems={cart.length > 0}
                onFinalize={handleFinalizeSale}
                onCancel={handleCancelSale}
                isFinalizing={isFinalizing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <SalesHistory sales={sales} onViewInvoice={handleViewInvoice} />

      <InvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
        sale={currentInvoice}
      />
    </div>
  )
}
