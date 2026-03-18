"use client"

import type { Sale } from "@/contexts/store-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Printer, Store } from "lucide-react"
import { useRef } from "react"

type InvoiceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale | null
}

export function InvoiceModal({ open, onOpenChange, sale }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!sale) return null

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura ${sale.id} - Pulpería Familiar Sierra</title>
          <meta charset="UTF-8">
          <style>
            /* Estilos optimizados para impresora térmica 80mm */
            @page {
              size: 80mm auto;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 80mm;
              min-width: 80mm;
              max-width: 80mm;
              margin: 0;
              padding: 0;
              font-family: 'Courier New', Courier, monospace;
              font-size: 11px;
              line-height: 1.2;
              color: #000;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              html, body {
                width: 80mm !important;
                min-width: 80mm !important;
                max-width: 80mm !important;
                margin: 0 !important;
                padding: 2mm !important;
                overflow: hidden;
              }
            }
            .receipt {
              width: 76mm;
              max-width: 76mm;
              padding: 2mm;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 4mm;
            }
            .header h1 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 2mm;
              line-height: 1.2;
            }
            .header p {
              font-size: 9px;
              margin: 0;
            }
            .info {
              margin-bottom: 4mm;
              font-size: 10px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 4mm;
              font-size: 10px;
            }
            th, td {
              padding: 1mm 0;
              text-align: left;
            }
            th {
              border-bottom: 1px dashed #000;
              font-size: 9px;
            }
            td:first-child {
              max-width: 35mm;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .text-right {
              text-align: right;
            }
            .totals {
              border-top: 1px dashed #000;
              padding-top: 3mm;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1mm;
              font-size: 10px;
            }
            .total-row.grand {
              font-size: 12px;
              font-weight: bold;
              margin-top: 3mm;
              padding-top: 3mm;
              border-top: 1px solid #000;
            }
            .footer {
              text-align: center;
              margin-top: 4mm;
              font-size: 9px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 3mm 0;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>Pulpería Familiar Sierra</h1>
              <p>RTN: 0801-1234-56789</p>
              <p>Tel: +504 2234-5678</p>
              <p>Tegucigalpa, Honduras</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="info">
              <div class="info-row">
                <span>Factura No:</span>
                <span>${sale.id}</span>
              </div>
              <div class="info-row">
                <span>Fecha:</span>
                <span>${sale.date}</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th class="text-right">Cant.</th>
                  <th class="text-right">Precio</th>
                  <th class="text-right">Subt.</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items.map((item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">L ${item.price.toFixed(2)}</td>
                    <td class="text-right">L ${item.subtotal.toFixed(2)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>L ${sale.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>ISV (15%):</span>
                <span>L ${sale.tax.toFixed(2)}</span>
              </div>
              <div class="total-row grand">
                <span>TOTAL:</span>
                <span>L ${sale.total.toFixed(2)}</span>
              </div>
            </div>
          
            <div class="footer">
              <p>¡Gracias por su compra!</p>
              <p>Vuelva pronto</p>
            </div>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Factura de Venta
          </DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold">Pulpería Familiar Sierra</h2>
            <p className="text-xs text-muted-foreground">RTN: 0801-1234-56789</p>
            <p className="text-xs text-muted-foreground">Tel: +504 2234-5678</p>
            <p className="text-xs text-muted-foreground">Tegucigalpa, Honduras</p>
          </div>

          <Separator />

          {/* Invoice Info */}
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Factura No:</p>
              <p className="font-semibold">{sale.id}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Fecha:</p>
              <p className="font-semibold">{sale.date}</p>
            </div>
          </div>

          <Separator />

          {/* Items Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Producto</TableHead>
                <TableHead className="text-xs text-center">Cant.</TableHead>
                <TableHead className="text-xs text-right">Precio</TableHead>
                <TableHead className="text-xs text-right">Subt.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="text-sm py-2">{item.productName}</TableCell>
                  <TableCell className="text-sm text-center py-2">{item.quantity}</TableCell>
                  <TableCell className="text-sm text-right py-2">
                    L {item.price.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-sm text-right py-2">
                    L {item.subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>L {sale.subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ISV (15%):</span>
              <span>L {sale.tax.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL:</span>
              <span className="text-primary">
                L {sale.total.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">¡Gracias por su compra!</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Factura
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
