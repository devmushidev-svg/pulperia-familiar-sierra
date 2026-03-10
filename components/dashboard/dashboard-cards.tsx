"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Productos Totales",
    value: "248",
    description: "+12 este mes",
    icon: Package,
    trend: "up",
  },
  {
    title: "Ventas del Día",
    value: "34",
    description: "+8% vs ayer",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Ingresos del Día",
    value: "₡45,230",
    description: "+15% vs ayer",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Bajo Inventario",
    value: "8",
    description: "Requieren atención",
    icon: AlertTriangle,
    trend: "warning",
  },
]

export function DashboardCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon
              className={`h-4 w-4 ${
                stat.trend === "warning"
                  ? "text-warning"
                  : "text-primary"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.trend === "warning"
                  ? "text-warning"
                  : "text-muted-foreground"
              }`}
            >
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
