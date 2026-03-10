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

const recentSales = [
  {
    id: "V001",
    product: "Coca-Cola 600ml",
    quantity: 3,
    price: 850,
    total: 2550,
    date: "Hoy, 14:32",
  },
  {
    id: "V002",
    product: "Leche Dos Pinos 1L",
    quantity: 2,
    price: 1200,
    total: 2400,
    date: "Hoy, 14:15",
  },
  {
    id: "V003",
    product: "Arroz Tío Pelón 1kg",
    quantity: 1,
    price: 1500,
    total: 1500,
    date: "Hoy, 13:48",
  },
  {
    id: "V004",
    product: "Pan Bimbo Blanco",
    quantity: 2,
    price: 1800,
    total: 3600,
    date: "Hoy, 13:22",
  },
  {
    id: "V005",
    product: "Huevos Docena",
    quantity: 1,
    price: 2800,
    total: 2800,
    date: "Hoy, 12:55",
  },
]

export function RecentSales() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Ventas Recientes</CardTitle>
        <CardDescription>Las últimas 5 ventas registradas hoy</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Precio</TableHead>
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
                <TableCell className="font-medium">{sale.product}</TableCell>
                <TableCell className="text-center">{sale.quantity}</TableCell>
                <TableCell className="text-right">L {sale.price.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">L {sale.total.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">{sale.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
