"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

const data = [
  { name: "Coca-Cola 600ml", value: 156, color: "oklch(0.55 0.15 160)" },
  { name: "Leche Dos Pinos", value: 124, color: "oklch(0.6 0.12 200)" },
  { name: "Arroz Tío Pelón", value: 98, color: "oklch(0.5 0.1 280)" },
  { name: "Pan Bimbo", value: 87, color: "oklch(0.7 0.15 80)" },
  { name: "Otros", value: 235, color: "oklch(0.65 0.18 30)" },
]

export function TopProductsReport() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Productos Más Vendidos</CardTitle>
        <CardDescription>Distribución de ventas por producto (mes actual)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
        </div>
      </CardContent>
    </Card>
  )
}
