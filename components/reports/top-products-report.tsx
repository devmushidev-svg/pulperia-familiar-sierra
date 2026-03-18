"use client"

/**
 * Gráfico de productos más vendidos del mes actual.
 *
 * Proceso: Filtra ventas por mes, agrupa por productName sumando quantity,
 * ordena descendente y toma top 5. Renderiza PieChart o mensaje vacío.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { useStore } from "@/contexts/store-context"
import { useMemo } from "react"

const COLORS = [
  "oklch(0.55 0.15 160)",
  "oklch(0.6 0.12 200)",
  "oklch(0.5 0.1 280)",
  "oklch(0.7 0.15 80)",
  "oklch(0.65 0.18 30)",
]

export function TopProductsReport() {
  const { sales } = useStore()

  const data = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime()

    const productSales: Record<string, number> = {}

    sales.forEach((sale) => {
      const saleTime = sale.created_at ? new Date(sale.created_at).getTime() : 0
      if (saleTime < monthStart || saleTime > monthEnd) return

      sale.items.forEach((item) => {
        const name = item.productName
        productSales[name] = (productSales[name] || 0) + item.quantity
      })
    })

    const sorted = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length],
      }))

    return sorted
  }, [sales])
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Productos Más Vendidos</CardTitle>
        <CardDescription>Distribución de ventas por producto (mes actual)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No hay ventas registradas aún
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0.005 250)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value} unidades`, ""]}
                labelStyle={{ color: "oklch(0.15 0.01 250)", fontWeight: 600 }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "oklch(0.5 0.01 250)", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
