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

const data = [
  { name: "Lun", ventas: 12000 },
  { name: "Mar", ventas: 19000 },
  { name: "Mié", ventas: 15000 },
  { name: "Jue", ventas: 22000 },
  { name: "Vie", ventas: 28000 },
  { name: "Sáb", ventas: 35000 },
  { name: "Dom", ventas: 18000 },
]

export function SalesChart() {
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
                tickFormatter={(value) => `₡${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0.005 250)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`₡${value.toLocaleString()}`, "Ventas"]}
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
