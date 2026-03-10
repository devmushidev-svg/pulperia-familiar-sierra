"use client"

import type { Sale } from "@/app/(dashboard)/ventas/page"
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
import { Receipt } from "lucide-react"

type SalesTableProps = {
  sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
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
              <TableHead>ID Venta</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
                  <TableCell className="font-medium">{sale.product}</TableCell>
                  <TableCell className="text-center">{sale.quantity}</TableCell>
                  <TableCell className="text-right">L {sale.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    L {sale.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{sale.date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
