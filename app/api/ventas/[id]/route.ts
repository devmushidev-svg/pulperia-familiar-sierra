import { NextResponse } from "next/server"
import db from "@/lib/database"
import type { VentaDB, DetalleVentaDB } from "../route"

// GET - Obtener una venta por ID con sus detalles
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const venta = db.prepare("SELECT * FROM ventas WHERE id = ?").get(id) as VentaDB | undefined

    if (!venta) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    const detalles = db.prepare(`
      SELECT * FROM detalle_ventas WHERE venta_id = ?
    `).all(id) as DetalleVentaDB[]

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error al obtener venta:", error)
    return NextResponse.json({ error: "Error al obtener venta" }, { status: 500 })
  }
}

// DELETE - Eliminar una venta (solo admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Las foreign keys con ON DELETE CASCADE eliminan los detalles automáticamente
    const stmt = db.prepare("DELETE FROM ventas WHERE id = ?")
    const result = stmt.run(id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar venta:", error)
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 })
  }
}
