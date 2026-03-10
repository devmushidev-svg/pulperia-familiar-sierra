"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, X, Calculator } from "lucide-react"

type SaleSummaryProps = {
  subtotal: number
  tax: number
  total: number
  hasItems: boolean
  onFinalize: () => void
  onCancel: () => void
}

export function SaleSummary({
  subtotal,
  tax,
  total,
  hasItems,
  onFinalize,
  onCancel,
}: SaleSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        Totales de la Venta
      </h3>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">
            L {subtotal.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">ISV (15%)</span>
          <span className="font-medium">
            L {tax.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Total a Pagar</span>
          <span className="text-2xl font-bold text-primary">
            L {total.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={onFinalize}
          disabled={!hasItems}
        >
          <Check className="mr-2 h-4 w-4" />
          Finalizar Venta
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={!hasItems}
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar Venta
        </Button>
      </div>
    </div>
  )
}
