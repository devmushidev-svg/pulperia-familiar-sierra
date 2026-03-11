"use client"

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Table2, Eye, Code } from "lucide-react"
import { redirect } from "next/navigation"

export default function BaseDatosPage() {
  const { isAdmin } = useAuth()
  const { getSchema, executeQuery } = useStore()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([])

  if (!isAdmin) {
    redirect("/")
  }

  const schema = getSchema()

  const handleViewTable = (tableName: string) => {
    setSelectedTable(tableName)
    setTableData(executeQuery(tableName))
  }

  const getSQLCreate = (tableName: string) => {
    switch (tableName) {
      case "productos":
        return `CREATE TABLE productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 5,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);`
      case "ventas":
        return `CREATE TABLE ventas (
  id TEXT PRIMARY KEY,
  subtotal REAL NOT NULL,
  isv REAL NOT NULL,
  total REAL NOT NULL,
  fecha TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);`
      case "detalle_ventas":
        return `CREATE TABLE detalle_ventas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id TEXT NOT NULL,
  producto_id TEXT NOT NULL,
  nombre_producto TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario REAL NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id)
);`
      case "usuarios":
        return `CREATE TABLE usuarios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol TEXT NOT NULL CHECK(rol IN ('admin', 'operario')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);`
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Base de Datos</h1>
        <p className="text-muted-foreground">
          Visualizador de tablas SQLite - Pulperia Familiar Sierra
        </p>
      </div>

      {/* Esquema de tablas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {schema.map((table) => (
          <Card key={table.tableName} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{table.tableName}</CardTitle>
              </div>
              <CardDescription>{table.rowCount} registros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-3">
                {table.columns.slice(0, 4).map((col) => (
                  <Badge key={col} variant="secondary" className="text-xs">
                    {col}
                  </Badge>
                ))}
                {table.columns.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{table.columns.length - 4}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleViewTable(table.tableName)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver datos
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SQL CREATE statements */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <CardTitle>Estructura SQL</CardTitle>
          </div>
          <CardDescription>
            Sentencias CREATE TABLE utilizadas en la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {schema.map((table) => (
              <div key={table.tableName} className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold mb-2 text-sm text-primary">
                  {table.tableName}
                </h4>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                  {getSQLCreate(table.tableName)}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Datos de la tabla seleccionada */}
      {selectedTable && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>SELECT * FROM {selectedTable}</CardTitle>
              </div>
              <Badge variant="outline">{tableData.length} registros</Badge>
            </div>
            <CardDescription>
              Mostrando todos los datos de la tabla {selectedTable}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableData.length > 0 &&
                      Object.keys(tableData[0]).map((key) => (
                        <TableHead key={key} className="whitespace-nowrap">
                          {key}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={100} className="text-center text-muted-foreground py-8">
                        No hay datos en esta tabla
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i} className="whitespace-nowrap font-mono text-sm">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value ?? "NULL")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
