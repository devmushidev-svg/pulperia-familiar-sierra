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
import { Progress } from "@/components/ui/progress"
import { Package } from "lucide-react"
import { useStore } from "@/contexts/store-context"

const statusLabels: Record<string, string> = {
  optimo: "Óptimo",
  bajo: "Bajo",
  agotado: "Agotado",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  optimo: "default",
  bajo: "secondary",
  agotado: "destructive",
}

function getStockStatus(stock: number, minStock: number): "optimo" | "bajo" | "agotado" {
  if (stock <= 0) return "agotado"
  if (stock <= minStock) return "bajo"
  return "optimo"
}

export function InventoryReport() {
  const { products } = useStore()

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Package className="h-5 w-5 text-primary" />
          Estado del Inventario
        </CardTitle>
        <CardDescription>Resumen del inventario actual con niveles de stock</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-center">Stock Actual</TableHead>
              <TableHead className="text-center">Stock Mínimo</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No hay productos en el inventario
                </TableCell>
              </TableRow>
            ) : (
              products.map((item) => {
                const status = getStockStatus(item.stock, item.stock_minimo)
                const percentage = item.stock_minimo > 0
                  ? Math.min((item.stock / (item.stock_minimo * 2)) * 100, 100)
                  : 100
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.stock}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{item.stock_minimo}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress
                          value={percentage}
                          className={`h-2 ${
                            status === "agotado"
                              ? "[&>div]:bg-destructive"
                              : status === "bajo"
                              ? "[&>div]:bg-warning"
                              : ""
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[status]}>
                        {statusLabels[status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
