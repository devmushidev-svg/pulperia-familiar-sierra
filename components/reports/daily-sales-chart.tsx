"use client"

/**
 * Gráfico de ventas diarias del mes actual.
 *
 * Proceso: Itera días 1 hasta hoy, filtra ventas por created_at en cada día,
 * suma totales. Renderiza BarChart con datos reales o mensaje vacío.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { useStore } from "@/contexts/store-context"
import { useMemo } from "react"

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function DailySalesChart() {
  const { sales } = useStore()

  const data = useMemo(() => {
    const today = new Date()
    const result = []
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    for (let d = 1; d <= Math.min(daysInMonth, today.getDate()); d++) {
      const dayDate = new Date(today.getFullYear(), today.getMonth(), d)
      const dayStart = dayDate.getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1

      const daySales = sales.filter((sale) => {
        const saleTime = sale.created_at ? new Date(sale.created_at).getTime() : null
        if (saleTime !== null) {
          return saleTime >= dayStart && saleTime <= dayEnd
        }
        const datePart = sale.fecha?.split(",")[0]?.trim()
        if (datePart) {
          const [day, month, year] = datePart.split("/").map(Number)
          if (day && month && year) {
            const parsed = new Date(year, month - 1, day).getTime()
            return parsed >= dayStart && parsed <= dayEnd
          }
        }
        return false
      })

      const total = daySales.reduce((sum, s) => sum + s.total, 0)
      result.push({
        day: String(d),
        ventas: total,
        diaSemana: DAY_NAMES[dayDate.getDay()],
      })
    }
    return result
  }, [sales])
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Ventas por Día</CardTitle>
        <CardDescription>Ingresos diarios del mes actual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No hay datos de ventas para el mes actual
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.01 250)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.01 250)", fontSize: 12 }}
                tickFormatter={(value) => `L${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0.005 250)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`L ${value.toLocaleString()}`, "Ventas"]}
                labelFormatter={(label) => `Día ${label}`}
                labelStyle={{ color: "oklch(0.15 0.01 250)", fontWeight: 600 }}
              />
              <Bar
                dataKey="ventas"
                fill="oklch(0.55 0.15 160)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
