"use client"

/**
 * Top 5 productos más vendidos. Agrupa ventas por productName, suma quantity,
 * ordena y muestra barra de progreso relativa.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/contexts/store-context"
import { useMemo } from "react"

export function TopProducts() {
  const { sales } = useStore()

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; sales: number }> = {}
    
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (productSales[item.productId]) {
          productSales[item.productId].sales += item.quantity
        } else {
          productSales[item.productId] = {
            name: item.productName,
            sales: item.quantity,
          }
        }
      })
    })

    const sorted = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    const maxSales = sorted[0]?.sales || 1
    return sorted.map((p) => ({
      ...p,
      percentage: Math.round((p.sales / maxSales) * 100),
    }))
  }, [sales])

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Productos Más Vendidos</CardTitle>
        <CardDescription>Los productos con más ventas registradas</CardDescription>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No hay ventas registradas aún
          </p>
        ) : (
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
                  <span className="text-sm text-muted-foreground">{product.sales} unidades</span>
                </div>
                <Progress value={product.percentage} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
