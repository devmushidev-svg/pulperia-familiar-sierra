/**
 * Capa de persistencia de datos
 *
 * Simula una base de datos relacional usando localStorage. Cada "tabla" se almacena
 * en una clave distinta. Al iniciar, crea las tablas si no existen e inserta datos
 * de ejemplo. Las operaciones CRUD mantienen consistencia entre ventas, detalle_ventas
 * y productos (descuento de stock al vender).
 */

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
  id: number
  venta_id: string
  producto_id: string
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export type User = {
  id: string
  nombre: string
  email: string
  password: string
  rol: "admin" | "operario"
  created_at: string
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

const TABLES = {
  productos: "pulperia_tabla_productos",
  ventas: "pulperia_tabla_ventas",
  detalle_ventas: "pulperia_tabla_detalle_ventas",
  usuarios: "pulperia_tabla_usuarios",
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", nombre: "Coca-Cola 600ml", categoria: "Bebidas", precio: 25, stock: 48, stock_minimo: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", nombre: "Leche Sula 1L", categoria: "Lácteos", precio: 32, stock: 24, stock_minimo: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", nombre: "Arroz Progreso 1lb", categoria: "Granos", precio: 18, stock: 36, stock_minimo: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", nombre: "Pan Bimbo Blanco", categoria: "Panadería", precio: 45, stock: 15, stock_minimo: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "5", nombre: "Huevos Docena", categoria: "Lácteos", precio: 65, stock: 20, stock_minimo: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "6", nombre: "Frijoles 1lb", categoria: "Granos", precio: 22, stock: 30, stock_minimo: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "7", nombre: "Aceite Mazola 750ml", categoria: "Aceites", precio: 85, stock: 12, stock_minimo: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "8", nombre: "Azúcar 1lb", categoria: "Granos", precio: 15, stock: 40, stock_minimo: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

const INITIAL_USERS: User[] = [
  { id: "1", nombre: "Carlos Sierra", email: "admin@pulperia.hn", password: "admin123", rol: "admin", created_at: new Date().toISOString() },
  { id: "2", nombre: "María López", email: "operario@pulperia.hn", password: "operario123", rol: "operario", created_at: new Date().toISOString() },
]

class LocalDatabase {
  private initialized = false

  init() {
    if (this.initialized || typeof window === "undefined") return

    if (!localStorage.getItem(TABLES.productos)) {
      localStorage.setItem(TABLES.productos, JSON.stringify(INITIAL_PRODUCTS))
    }

    if (!localStorage.getItem(TABLES.ventas)) {
      localStorage.setItem(TABLES.ventas, JSON.stringify([]))
    }

    if (!localStorage.getItem(TABLES.detalle_ventas)) {
      localStorage.setItem(TABLES.detalle_ventas, JSON.stringify([]))
    }

    if (!localStorage.getItem(TABLES.usuarios)) {
      localStorage.setItem(TABLES.usuarios, JSON.stringify(INITIAL_USERS))
    }
    
    this.initialized = true
  }

  selectAllProducts(): Product[] {
    this.init()
    if (typeof window === "undefined") return INITIAL_PRODUCTS
    const data = localStorage.getItem(TABLES.productos)
    return data ? JSON.parse(data) : INITIAL_PRODUCTS
  }

  selectProductById(id: string): Product | undefined {
    const products = this.selectAllProducts()
    return products.find((p) => p.id === id)
  }

  insertProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Product {
    const products = this.selectAllProducts()
    const newProduct: Product = {
      ...product,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    products.push(newProduct)
    localStorage.setItem(TABLES.productos, JSON.stringify(products))
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.selectAllProducts()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem(TABLES.productos, JSON.stringify(products))
    return products[index]
  }

  deleteProduct(id: string): boolean {
    const products = this.selectAllProducts()
    const filtered = products.filter((p) => p.id !== id)
    if (filtered.length === products.length) return false
    localStorage.setItem(TABLES.productos, JSON.stringify(filtered))
    return true
  }

  selectAllSales(): Sale[] {
    this.init()
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TABLES.ventas)
    return data ? JSON.parse(data) : []
  }

  selectSaleDetails(ventaId: string): SaleDetail[] {
    this.init()
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TABLES.detalle_ventas)
    const details: SaleDetail[] = data ? JSON.parse(data) : []
    return details.filter((d) => d.venta_id === ventaId)
  }

  insertSale(sale: { items: CartItem[]; subtotal: number; tax: number; total: number; date: string }): SaleWithItems {
    const sales = this.selectAllSales()
    const details = this.getAllSaleDetails()
    
    const newSale: Sale = {
      id: String(Date.now()),
      subtotal: sale.subtotal,
      isv: sale.tax,
      total: sale.total,
      fecha: sale.date,
      created_at: new Date().toISOString(),
    }

    sales.push(newSale)
    localStorage.setItem(TABLES.ventas, JSON.stringify(sales))

    let lastDetailId = details.length > 0 ? Math.max(...details.map((d) => d.id)) : 0
    
    const newDetails: SaleDetail[] = sale.items.map((item) => ({
      id: ++lastDetailId,
      venta_id: newSale.id,
      producto_id: item.productId,
      nombre_producto: item.productName,
      cantidad: item.quantity,
      precio_unitario: item.price,
      subtotal: item.subtotal,
    }))
    
    details.push(...newDetails)
    localStorage.setItem(TABLES.detalle_ventas, JSON.stringify(details))

    sale.items.forEach((item) => {
      const product = this.selectProductById(item.productId)
      if (product) {
        this.updateProduct(item.productId, { stock: product.stock - item.quantity })
      }
    })
    
    return {
      ...newSale,
      items: sale.items,
      tax: sale.tax,
      date: sale.date,
    }
  }

  getAllSaleDetails(): SaleDetail[] {
    this.init()
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TABLES.detalle_ventas)
    return data ? JSON.parse(data) : []
  }

  selectAllUsers(): User[] {
    this.init()
    if (typeof window === "undefined") return INITIAL_USERS
    const data = localStorage.getItem(TABLES.usuarios)
    return data ? JSON.parse(data) : INITIAL_USERS
  }

  authenticateUser(email: string, password: string): User | null {
    const users = this.selectAllUsers()
    return users.find((u) => u.email === email && u.password === password) || null
  }

  selectAllSalesWithDetails(): SaleWithItems[] {
    const sales = this.selectAllSales()
    return sales.map((sale) => {
      const details = this.selectSaleDetails(sale.id)
      return {
        ...sale,
        items: details.map((d) => ({
          productId: d.producto_id,
          productName: d.nombre_producto,
          quantity: d.cantidad,
          price: d.precio_unitario,
          subtotal: d.subtotal,
        })),
        tax: sale.isv,
        date: sale.fecha,
      }
    })
  }

  getSchema(): { tableName: string; columns: string[]; rowCount: number }[] {
    return [
      {
        tableName: "productos",
        columns: ["id", "nombre", "categoria", "precio", "stock", "stock_minimo", "created_at", "updated_at"],
        rowCount: this.selectAllProducts().length,
      },
      {
        tableName: "ventas",
        columns: ["id", "subtotal", "isv", "total", "fecha", "created_at"],
        rowCount: this.selectAllSales().length,
      },
      {
        tableName: "detalle_ventas",
        columns: ["id", "venta_id", "producto_id", "nombre_producto", "cantidad", "precio_unitario", "subtotal"],
        rowCount: this.getAllSaleDetails().length,
      },
      {
        tableName: "usuarios",
        columns: ["id", "nombre", "email", "password", "rol", "created_at"],
        rowCount: this.selectAllUsers().length,
      },
    ]
  }

  executeQuery(tableName: string): Record<string, unknown>[] {
    switch (tableName) {
      case "productos":
        return this.selectAllProducts()
      case "ventas":
        return this.selectAllSales()
      case "detalle_ventas":
        return this.getAllSaleDetails()
      case "usuarios":
        return this.selectAllUsers().map((u) => ({ ...u, password: "****" }))
      default:
        return []
    }
  }
}

export const db = new LocalDatabase()
