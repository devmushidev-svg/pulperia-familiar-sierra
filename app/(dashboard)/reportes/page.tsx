"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DailySalesChart } from "@/components/reports/daily-sales-chart"
import { TopProductsReport } from "@/components/reports/top-products-report"
import { InventoryReport } from "@/components/reports/inventory-report"
import { CashRegisterClose } from "@/components/reports/cash-register-close"
import { useStore } from "@/contexts/store-context"
import { Banknote, TrendingUp, Package, ShoppingCart } from "lucide-react"

export default function ReportesPage() {
  const { products, sales } = useStore()

  // Calcular estadisticas reales
  const totalProductos = products.length
  const totalVentasMes = sales.length
  const ingresosMes = sales.reduce((sum, sale) => sum + sale.total, 0)
  const ticketPromedio = totalVentasMes > 0 ? Math.round(ingresosMes / totalVentasMes) : 0

  const summaryStats = [
    {
      title: "Ingresos Totales",
      value: `L ${ingresosMes.toLocaleString()}`,
      icon: Banknote,
    },
    {
      title: "Ventas Totales",
      value: totalVentasMes.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Ticket Promedio",
      value: `L ${ticketPromedio.toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Productos Activos",
      value: totalProductos.toString(),
      icon: Package,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Cierre de Caja */}
      <CashRegisterClose />

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DailySalesChart />
        <TopProductsReport />
      </div>

      <InventoryReport />
    </div>
  )
}
