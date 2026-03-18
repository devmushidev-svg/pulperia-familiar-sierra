"use client"

/**
 * Panel de control. Tarjetas (productos, ventas del día, ingresos, bajo inventario),
 * gráfico de ventas semanales, top productos y ventas recientes.
 */

import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProducts } from "@/components/dashboard/top-products"
import { RecentSales } from "@/components/dashboard/recent-sales"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart />
        <TopProducts />
      </div>
      <RecentSales />
    </div>
  )
}
