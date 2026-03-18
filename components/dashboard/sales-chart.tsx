"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { useStore } from "@/contexts/store-context"
import { useMemo } from "react"

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function SalesChart() {
  const { sales } = useStore()

  const data = useMemo(() => {
    const today = new Date()
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1

      const daySales = sales.filter((sale) => {
        const saleTime = sale.created_at ? new Date(sale.created_at).getTime() : null
        if (saleTime !== null) {
          return saleTime >= dayStart && saleTime <= dayEnd
        }
        const datePart = sale.date?.split(",")[0]?.trim()
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
        name: DAY_NAMES[d.getDay()],
        ventas: total,
        fecha: d.toLocaleDateString("es-HN"),
      })
    }
    return result
  }, [sales])
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Ventas de la Semana</CardTitle>
        <CardDescription>Ingresos diarios de los últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 160)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
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
                labelStyle={{ color: "oklch(0.15 0.01 250)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="oklch(0.55 0.15 160)"
                strokeWidth={2}
                fill="url(#colorVentas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
