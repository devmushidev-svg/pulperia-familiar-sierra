"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Banknote, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useStore } from "@/contexts/store-context"

export function DashboardCards() {
  const { isAdmin } = useAuth()
  const { products, sales } = useStore()

  // Calcular estadísticas reales
  const totalProducts = products.length
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const todayEnd = todayStart + 24 * 60 * 60 * 1000

  const todaySales = sales.filter((sale) => {
    const saleDate = sale.created_at ? new Date(sale.created_at).getTime() : null
    if (saleDate !== null) {
      return saleDate >= todayStart && saleDate < todayEnd
    }
    const datePart = sale.date?.split(",")[0]?.trim()
    if (datePart) {
      const [day, month, year] = datePart.split("/").map(Number)
      if (day && month && year) {
        const parsed = new Date(year, month - 1, day).getTime()
        return parsed >= todayStart && parsed < todayEnd
      }
    }
    return false
  })
  const todaySalesCount = todaySales.length
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0)
  const lowStockCount = products.filter((p) => p.stock <= p.stock_minimo).length

  const stats = [
    {
      title: "Productos Totales",
      value: totalProducts.toString(),
      description: "En inventario",
      icon: Package,
      trend: "up",
      adminOnly: false,
    },
    {
      title: "Ventas del Día",
      value: todaySalesCount.toString(),
      description: "Transacciones hoy",
      icon: ShoppingCart,
      trend: "up",
      adminOnly: false,
    },
    {
      title: "Ingresos del Día",
      value: `L ${todayRevenue.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`,
      description: "Total facturado",
      icon: Banknote,
      trend: "up",
      adminOnly: true,
    },
    {
      title: "Bajo Inventario",
      value: lowStockCount.toString(),
      description: "Requieren atención",
      icon: AlertTriangle,
      trend: "warning",
      adminOnly: false,
    },
  ]

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
