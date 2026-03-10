"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DailySalesChart } from "@/components/reports/daily-sales-chart"
import { TopProductsReport } from "@/components/reports/top-products-report"
import { InventoryReport } from "@/components/reports/inventory-report"
import { DollarSign, TrendingUp, Package, ShoppingCart } from "lucide-react"

const summaryStats = [
  {
    title: "Ingresos Totales (Mes)",
    value: "L 1,245,680",
    change: "+12.5%",
    icon: DollarSign,
  },
  {
    title: "Ventas Totales (Mes)",
    value: "892",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Ticket Promedio",
    value: "L 1,397",
    change: "+3.1%",
    icon: TrendingUp,
  },
  {
    title: "Productos Activos",
    value: "248",
    change: "+12",
    icon: Package,
  },
]

export default function ReportesPage() {
  return (
    <div className="flex flex-col gap-6">
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
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">{stat.change}</span> vs mes anterior
              </p>
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
