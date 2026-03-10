"use client"

import type { Sale } from "@/contexts/store-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Receipt, Eye } from "lucide-react"

type SalesHistoryProps = {
  sales: Sale[]
  onViewInvoice: (sale: Sale) => void
}

export function SalesHistory({ sales, onViewInvoice }: SalesHistoryProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Receipt className="h-5 w-5 text-primary" />
          Ventas Recientes
        </CardTitle>
        <CardDescription>Historial de las últimas ventas registradas</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Factura</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">ISV</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No hay ventas registradas.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {sale.id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      {sale.items.map((item, index) => (
                        <span key={item.productId} className="text-sm">
                          {item.productName} ({item.quantity})
                          {index < sale.items.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    L {sale.subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    L {sale.tax.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    L {sale.total.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{sale.date}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewInvoice(sale)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Ver Factura
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
