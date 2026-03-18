"use client"

/**
 * Cierre de Caja: resumen diario de ventas.
 *
 * Proceso: Filtra ventas del día por created_at, calcula totales (ventas, productos
 * vendidos, ISV, total). Muestra tarjetas y modal con detalle. handlePrint genera
 * HTML optimizado para impresora térmica.
 */

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calculator, Printer, Receipt, Banknote, ShoppingCart, Clock } from "lucide-react"

export function CashRegisterClose() {
  const { sales } = useStore()
  const [showCloseModal, setShowCloseModal] = useState(false)

  const today = new Date()
  const todayStr = today.toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const todayEnd = todayStart + 24 * 60 * 60 * 1000

  const todaySales = sales.filter((sale) => {
    const saleTime = sale.created_at ? new Date(sale.created_at).getTime() : null
    if (saleTime !== null) {
      return saleTime >= todayStart && saleTime < todayEnd
    }
    const datePart = sale.fecha?.split(",")[0]?.trim()
    if (datePart) {
      const [day, month, year] = datePart.split("/").map(Number)
      if (day && month && year) {
        const parsed = new Date(year, month - 1, day).getTime()
        return parsed >= todayStart && parsed < todayEnd
      }
    }
    return false
  })

  const totalVentas = todaySales.length
  const subtotalDia = todaySales.reduce((sum, sale) => sum + sale.subtotal, 0)
  const isvDia = todaySales.reduce((sum, sale) => sum + sale.isv, 0)
  const totalDia = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  const productosVendidos = todaySales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => itemSum + (item.quantity ?? 0), 0)
  }, 0)

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600")
    if (!printWindow) return

    const now = new Date()
    const hora = now.toLocaleTimeString("es-HN", {
      hour: "2-digit",
      minute: "2-digit",
    })

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cierre de Caja - ${todayStr}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; max-width: 280px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .title { font-size: 14px; font-weight: bold; }
          .subtitle { font-size: 10px; color: #666; }
          .section { margin: 10px 0; }
          .section-title { font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5px; }
          .row { display: flex; justify-content: space-between; margin: 3px 0; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .total-row { font-weight: bold; font-size: 14px; }
          .footer { text-align: center; margin-top: 15px; font-size: 10px; color: #666; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { text-align: left; padding: 2px 0; }
          th { border-bottom: 1px solid #000; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">PULPERIA FAMILIAR SIERRA</div>
          <div class="subtitle">Tel: +504 2234-5678 | Correo: pulperia@sierra.hn</div>
          <div class="subtitle">Dirección: Honduras</div>
        </div>
        
        <div class="section">
          <div class="row"><span>Fecha:</span><span>${todayStr}</span></div>
          <div class="row"><span>Hora cierre:</span><span>${hora}</span></div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
          <div class="section-title">RESUMEN DEL DIA</div>
          <div class="row"><span>Total de ventas:</span><span>${totalVentas}</span></div>
          <div class="row"><span>Productos vendidos:</span><span>${productosVendidos}</span></div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
          <div class="section-title">DETALLE DE VENTAS</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Hora</th>
                <th class="right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${todaySales.map(sale => `
                <tr>
                  <td>${sale.id.slice(-6).toUpperCase()}</td>
                  <td>${sale.fecha.split(",")[1]?.trim() || ""}</td>
                  <td class="right">L ${sale.total.toLocaleString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
          <div class="section-title">TOTALES</div>
          <div class="row"><span>Subtotal:</span><span>L ${subtotalDia.toLocaleString()}</span></div>
          <div class="row"><span>ISV (15%):</span><span>L ${isvDia.toLocaleString()}</span></div>
          <div class="divider"></div>
          <div class="row total-row"><span>TOTAL CAJA:</span><span>L ${totalDia.toLocaleString()}</span></div>
        </div>
        
        <div class="footer">
          <p>--- Cierre generado ---</p>
          <p>${now.toLocaleString("es-HN")}</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Cierre de Caja
              </CardTitle>
              <CardDescription>Resumen de ventas del dia {todayStr}</CardDescription>
            </div>
            <Button onClick={() => setShowCloseModal(true)}>
              <Receipt className="mr-2 h-4 w-4" />
              Ver Cierre
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ventas</p>
                <p className="text-2xl font-bold text-card-foreground">{totalVentas}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p className="text-2xl font-bold text-card-foreground">{productosVendidos}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ISV</p>
                <p className="text-2xl font-bold text-card-foreground">L {isvDia.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <Banknote className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/80">Total Caja</p>
                <p className="text-2xl font-bold text-primary-foreground">L {totalDia.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCloseModal} onOpenChange={setShowCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Cierre de Caja - {todayStr}
            </DialogTitle>
            <DialogDescription>
              Detalle completo de las ventas del dia
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {todaySales.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay ventas registradas hoy
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">ISV</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todaySales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {sale.id.slice(-6).toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sale.fecha.split(",")[1]?.trim() || "-"}
                          </TableCell>
                          <TableCell>
                            {sale.items.map((item) => item.productName).join(", ")}
                          </TableCell>
                          <TableCell className="text-right">
                            L {sale.subtotal.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            L {sale.isv.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            L {sale.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex gap-8 text-sm">
                        <span className="text-muted-foreground">Subtotal: <strong className="text-card-foreground">L {subtotalDia.toLocaleString()}</strong></span>
                        <span className="text-muted-foreground">ISV (15%): <strong className="text-card-foreground">L {isvDia.toLocaleString()}</strong></span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        Total en Caja: L {totalDia.toLocaleString()}
                      </div>
                    </div>
                    <Button onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir Cierre
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
