"use client"

import type { CartItem } from "@/app/(dashboard)/ventas/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, ShoppingBag } from "lucide-react"

type ShoppingCartProps = {
  items: CartItem[]
  onRemove: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
}

export function ShoppingCart({ items, onRemove, onUpdateQuantity }: ShoppingCartProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        Carrito de Venta
        {items.length > 0 && (
          <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {items.length}
          </span>
        )}
      </h3>

      {items.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">El carrito está vacío</p>
          <p className="text-xs text-muted-foreground">Agrega productos para comenzar</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Producto</TableHead>
                <TableHead className="text-xs text-center w-20">Cant.</TableHead>
                <TableHead className="text-xs text-right">Subtotal</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="py-2">
                    <div>
                      <p className="font-medium text-sm leading-tight">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        L {item.price.toLocaleString("es-HN", { minimumFractionDigits: 2 })} c/u
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value, 10) || 0)}
                      min="1"
                      className="h-8 w-16 text-center text-sm"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right font-medium text-sm">
                    L {item.subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onRemove(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
