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

const inventory = [
  { name: "Coca-Cola 600ml", category: "Bebidas", stock: 48, minStock: 20, status: "optimo" },
  { name: "Leche Dos Pinos 1L", category: "Lácteos", stock: 24, minStock: 15, status: "optimo" },
  { name: "Arroz Tío Pelón 1kg", category: "Abarrotes", stock: 5, minStock: 10, status: "bajo" },
  { name: "Pan Bimbo Blanco", category: "Panadería", stock: 12, minStock: 8, status: "optimo" },
  { name: "Huevos Docena", category: "Lácteos", stock: 0, minStock: 10, status: "agotado" },
  { name: "Frijoles Negros 1kg", category: "Abarrotes", stock: 18, minStock: 10, status: "optimo" },
  { name: "Aceite Vegetal 1L", category: "Abarrotes", stock: 8, minStock: 5, status: "optimo" },
  { name: "Café Britt 250g", category: "Abarrotes", stock: 3, minStock: 8, status: "bajo" },
]

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

export function InventoryReport() {
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
            {inventory.map((item) => {
              const percentage = Math.min((item.stock / (item.minStock * 2)) * 100, 100)
              return (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{item.stock}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{item.minStock}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress
                        value={percentage}
                        className={`h-2 ${
                          item.status === "agotado"
                            ? "[&>div]:bg-destructive"
                            : item.status === "bajo"
                            ? "[&>div]:bg-warning"
                            : ""
                        }`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[item.status]}>
                      {statusLabels[item.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
