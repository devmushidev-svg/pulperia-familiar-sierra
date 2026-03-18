"use client"

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
import { useStore } from "@/contexts/store-context"

export function RecentSales() {
  const { sales } = useStore()
  
  // Obtener las últimas 5 ventas (más recientes primero)
  const recentSales = [...sales]
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Ventas Recientes</CardTitle>
        <CardDescription>Las últimas ventas registradas</CardDescription>
      </CardHeader>
      <CardContent>
        {recentSales.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No hay ventas registradas aún
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {sale.id}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {sale.items.map((i) => i.productName).join(", ")}
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    L {sale.subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    L {sale.total.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{sale.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
