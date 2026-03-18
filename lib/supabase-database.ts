/**
 * Capa de persistencia con Supabase (PostgreSQL en la nube).
 *
 * Productos y ventas se almacenan en Supabase. Requiere NEXT_PUBLIC_SUPABASE_URL
 * y NEXT_PUBLIC_SUPABASE_ANON_KEY. Ejecutar scripts/001_create_tables.sql en el
 * SQL Editor de Supabase antes de usar.
 */

import { createClient } from "@/lib/supabase/client"

export type Product = {
  id: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  stock_minimo: number
  created_at: string
  updated_at: string
}

export type Sale = {
  id: string
  subtotal: number
  isv: number
  total: number
  fecha: string
  created_at: string
}

export type SaleDetail = {
  id: string
  venta_id: string
  producto_id: string | null
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export type CartItem = {
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export type SaleWithItems = Sale & {
  items: CartItem[]
  tax: number
  date: string
}

function getSupabase() {
  return createClient()
}

/** Formatea ISO o timestamp a string legible en español (Honduras). */
function formatDateForDisplay(isoOrDate: string): string {
  if (!isoOrDate) return ""
  const d = new Date(isoOrDate)
  if (isNaN(d.getTime())) return isoOrDate
  return d.toLocaleString("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export async function initDatabase(): Promise<void> {
  // Supabase no requiere inicialización; las tablas se crean con el SQL
}

export async function selectAllProducts(): Promise<Product[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error cargando productos:", error.message, error.code)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    precio: parseFloat(row.precio),
    stock: row.stock ?? 0,
    stock_minimo: row.stock_minimo ?? 5,
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at ?? new Date().toISOString(),
  }))
}

export async function selectProductById(id: string): Promise<Product | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).single()

  if (error || !data) return null

  return {
    id: data.id,
    nombre: data.nombre,
    categoria: data.categoria,
    precio: parseFloat(data.precio),
    stock: data.stock ?? 0,
    stock_minimo: data.stock_minimo ?? 5,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? new Date().toISOString(),
  }
}

export async function insertProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> {
  const supabase = getSupabase()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      stock: product.stock,
      stock_minimo: product.stock_minimo,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) throw new Error(`Error insertando producto: ${error.message}`)

  return {
    id: data.id,
    nombre: data.nombre,
    categoria: data.categoria,
    precio: parseFloat(data.precio),
    stock: data.stock ?? 0,
    stock_minimo: data.stock_minimo ?? 5,
    created_at: data.created_at ?? now,
    updated_at: data.updated_at ?? now,
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabase()
  const toUpdate: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() }
  delete toUpdate.id
  delete toUpdate.created_at

  const { data, error } = await supabase
    .from("productos")
    .update(toUpdate)
    .eq("id", id)
    .select()
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    nombre: data.nombre,
    categoria: data.categoria,
    precio: parseFloat(data.precio),
    stock: data.stock ?? 0,
    stock_minimo: data.stock_minimo ?? 5,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? new Date().toISOString(),
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase.from("productos").delete().eq("id", id)
  return !error
}

export async function selectAllSales(): Promise<Sale[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("ventas")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error cargando ventas:", error.message, error.code, error.details)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    subtotal: parseFloat(row.subtotal),
    isv: parseFloat(row.isv),
    total: parseFloat(row.total),
    fecha: formatDateForDisplay(row.fecha ?? row.created_at ?? new Date().toISOString()),
    created_at: row.created_at ?? new Date().toISOString(),
  }))
}

export async function selectSaleDetails(ventaId: string): Promise<SaleDetail[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("detalle_ventas")
    .select("*")
    .eq("venta_id", ventaId)

  if (error) return []

  return (data || []).map((row) => ({
    id: row.id,
    venta_id: row.venta_id,
    producto_id: row.producto_id,
    nombre_producto: row.nombre_producto,
    cantidad: row.cantidad ?? 0,
    precio_unitario: parseFloat(row.precio_unitario),
    subtotal: parseFloat(row.subtotal),
  }))
}

export async function insertSale(sale: {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  date: string
}): Promise<SaleWithItems> {
  const supabase = getSupabase()
  const now = new Date().toISOString()
  const dateStr = sale.date

  const { data: ventaData, error: ventaError } = await supabase
    .from("ventas")
    .insert({
      subtotal: sale.subtotal,
      isv: sale.tax,
      total: sale.total,
      fecha: dateStr,
      created_at: now,
    })
    .select()
    .single()

  if (ventaError) throw new Error(`Error insertando venta: ${ventaError.message}`)

  const ventaId = ventaData.id

  const detalles = sale.items.map((item) => ({
    venta_id: ventaId,
    producto_id: item.productId,
    nombre_producto: item.productName,
    cantidad: item.quantity,
    precio_unitario: item.price,
    subtotal: item.subtotal,
  }))

  const { error: detalleError } = await supabase.from("detalle_ventas").insert(detalles)

  if (detalleError) throw new Error(`Error insertando detalle: ${detalleError.message}`)

  for (const item of sale.items) {
    const product = await selectProductById(item.productId)
    if (product) {
      await updateProduct(item.productId, { stock: product.stock - item.quantity })
    }
  }

  return {
    id: ventaData.id,
    subtotal: parseFloat(ventaData.subtotal),
    isv: parseFloat(ventaData.isv),
    total: parseFloat(ventaData.total),
    fecha: formatDateForDisplay(ventaData.fecha ?? ventaData.created_at ?? now),
    created_at: ventaData.created_at ?? now,
    items: sale.items,
    tax: sale.tax,
    date: formatDateForDisplay(ventaData.fecha ?? ventaData.created_at ?? now),
  }
}

export async function selectAllSalesWithDetails(): Promise<SaleWithItems[]> {
  const sales = await selectAllSales()
  const result: SaleWithItems[] = []

  for (const sale of sales) {
    const details = await selectSaleDetails(sale.id)
    result.push({
      ...sale,
      items: details.map((d) => ({
        productId: d.producto_id ?? "",
        productName: d.nombre_producto,
        quantity: d.cantidad,
        price: d.precio_unitario,
        subtotal: d.subtotal,
      })),
      tax: sale.isv,
      date: sale.fecha,
    })
  }

  return result
}

export async function getSchema(): Promise<
  { tableName: string; columns: string[]; rowCount: number }[]
> {
  const [products, sales, details] = await Promise.all([
    selectAllProducts(),
    selectAllSales(),
    selectAllSalesWithDetails(),
  ])

  const detailCount = details.reduce((sum, s) => sum + s.items.length, 0)

  return [
    {
      tableName: "productos",
      columns: ["id", "nombre", "categoria", "precio", "stock", "stock_minimo", "created_at", "updated_at"],
      rowCount: products.length,
    },
    {
      tableName: "ventas",
      columns: ["id", "subtotal", "isv", "total", "fecha", "created_at"],
      rowCount: sales.length,
    },
    {
      tableName: "detalle_ventas",
      columns: ["id", "venta_id", "producto_id", "nombre_producto", "cantidad", "precio_unitario", "subtotal"],
      rowCount: detailCount,
    },
  ]
}

export async function executeQuery(tableName: string): Promise<Record<string, unknown>[]> {
  switch (tableName) {
    case "productos":
      return await selectAllProducts()
    case "ventas":
      return await selectAllSales()
    case "detalle_ventas":
      const sales = await selectAllSalesWithDetails()
      return sales.flatMap((s) =>
        s.items.map((item) => ({
          venta_id: s.id,
          producto_id: item.productId,
          nombre_producto: item.productName,
          cantidad: item.quantity,
          precio_unitario: item.price,
          subtotal: item.subtotal,
        }))
      )
    default:
      return []
  }
}
