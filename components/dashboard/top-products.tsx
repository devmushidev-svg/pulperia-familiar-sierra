"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const topProducts = [
  { name: "Coca-Cola 600ml", sales: 156, percentage: 100 },
  { name: "Leche Dos Pinos 1L", sales: 124, percentage: 79 },
  { name: "Arroz Tío Pelón 1kg", sales: 98, percentage: 63 },
  { name: "Pan Bimbo Blanco", sales: 87, percentage: 56 },
  { name: "Huevos Docena", sales: 72, percentage: 46 },
]

export function TopProducts() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Productos Más Vendidos</CardTitle>
        <CardDescription>Los 5 productos con más ventas esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{product.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{product.sales} uds</span>
              </div>
              <Progress value={product.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
