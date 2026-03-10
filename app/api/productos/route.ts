import { NextResponse } from "next/server"
import db from "@/lib/database"

export type ProductoDB = {
  id: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  stock_minimo: number
  created_at: string
  updated_at: string
}

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = db.prepare("SELECT * FROM productos ORDER BY nombre").all() as ProductoDB[]
    return NextResponse.json(productos)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// POST - Crear un nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, nombre, categoria, precio, stock, stock_minimo } = body

    const stmt = db.prepare(`
      INSERT INTO productos (id, nombre, categoria, precio, stock, stock_minimo)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    stmt.run(id, nombre, categoria, precio, stock, stock_minimo)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
