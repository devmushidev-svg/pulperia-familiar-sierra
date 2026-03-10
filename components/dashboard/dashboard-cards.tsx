"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const stats = [
  {
    title: "Productos Totales",
    value: "248",
    description: "+12 este mes",
    icon: Package,
    trend: "up",
    adminOnly: false,
  },
  {
    title: "Ventas del Día",
    value: "34",
    description: "+8% vs ayer",
    icon: ShoppingCart,
    trend: "up",
    adminOnly: false,
  },
  {
    title: "Ingresos del Día",
    value: "L 45,230",
    description: "+15% vs ayer",
    icon: DollarSign,
    trend: "up",
    adminOnly: true,
  },
  {
    title: "Bajo Inventario",
    value: "8",
    description: "Requieren atención",
    icon: AlertTriangle,
    trend: "warning",
    adminOnly: false,
  },
]

export function DashboardCards() {
  const { isAdmin } = useAuth()
  const visibleStats = stats.filter((stat) => !stat.adminOnly || isAdmin)
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {visibleStats.map((stat) => (
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
