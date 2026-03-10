"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const data = [
  { day: "1", ventas: 32500 },
  { day: "2", ventas: 28000 },
  { day: "3", ventas: 42000 },
  { day: "4", ventas: 38500 },
  { day: "5", ventas: 51000 },
  { day: "6", ventas: 62000 },
  { day: "7", ventas: 35000 },
  { day: "8", ventas: 29000 },
  { day: "9", ventas: 45230 },
]

export function DailySalesChart() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Ventas por Día</CardTitle>
        <CardDescription>Ingresos diarios del mes actual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
        </div>
      </CardContent>
    </Card>
  )
}
