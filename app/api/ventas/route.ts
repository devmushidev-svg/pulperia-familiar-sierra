import { NextResponse } from "next/server"
import db from "@/lib/database"

export type VentaDB = {
  id: string
  subtotal: number
  isv: number
  total: number
  fecha: string
  created_at: string
}

export type DetalleVentaDB = {
  id: number
  venta_id: string
  producto_id: string
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

// GET - Obtener todas las ventas con sus detalles
export async function GET() {
  try {
    const ventas = db.prepare(`
      SELECT * FROM ventas ORDER BY created_at DESC
    `).all() as VentaDB[]

    // Para cada venta, obtener sus detalles
    const ventasConDetalles = ventas.map((venta) => {
      const detalles = db.prepare(`
        SELECT * FROM detalle_ventas WHERE venta_id = ?
      `).all(venta.id) as DetalleVentaDB[]

      return {
        id: venta.id,
        items: detalles.map((d) => ({
          productId: d.producto_id,
          productName: d.nombre_producto,
          quantity: d.cantidad,
          price: d.precio_unitario,
          subtotal: d.subtotal,
        })),
        subtotal: venta.subtotal,
        tax: venta.isv,
        total: venta.total,
        date: venta.fecha,
      }
    })

    return NextResponse.json(ventasConDetalles)
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    return NextResponse.json({ error: "Error al obtener ventas" }, { status: 500 })
  }
}

// POST - Crear una nueva venta
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, items, subtotal, tax, total, date } = body

    // Usar transacción para asegurar consistencia
    const insertVenta = db.prepare(`
      INSERT INTO ventas (id, subtotal, isv, total, fecha)
      VALUES (?, ?, ?, ?, ?)
    `)

    const insertDetalle = db.prepare(`
      INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const updateStock = db.prepare(`
      UPDATE productos SET stock = stock - ? WHERE id = ?
    `)

    const transaction = db.transaction(() => {
      // Insertar la venta
      insertVenta.run(id, subtotal, tax, total, date)

      // Insertar los detalles y actualizar stock
      for (const item of items) {
        insertDetalle.run(
          id,
          item.productId,
          item.productName,
          item.quantity,
          item.price,
          item.subtotal
        )
        updateStock.run(item.quantity, item.productId)
      }
    })

    transaction()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error al crear venta:", error)
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 })
  }
}
