"use client"

/**
 * Tabla de productos con búsqueda. Columnas: producto, categoría, precio, stock,
 * estado. Menú de acciones (editar, eliminar) por fila.
 */

import type { Product } from "@/contexts/store-context"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type ProductsTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

function getStatus(product: Product): "disponible" | "bajo_stock" | "agotado" {
  if (product.stock === 0) return "agotado"
  if (product.stock <= product.stock_minimo) return "bajo_stock"
  return "disponible"
}

const statusLabels = {
  disponible: "Disponible",
  bajo_stock: "Bajo Stock",
  agotado: "Agotado",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  disponible: "default",
  bajo_stock: "secondary",
  agotado: "destructive",
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const { isAdmin } = useAuth()

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const status = getStatus(product)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.nombre}</span>
                        <span className="text-xs text-muted-foreground">ID: {product.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      L {product.precio.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[status]}>
                        {statusLabels[status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem
                              onClick={() => onDelete(product.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
