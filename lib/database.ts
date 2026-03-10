"use server"

import Database from "better-sqlite3"
import path from "path"

// El archivo de base de datos se guarda en la raíz del proyecto
const dbPath = path.join(process.cwd(), "pulperia.db")

// Crear conexión a la base de datos
const db = new Database(dbPath)

// Habilitar foreign keys
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ventas (
    id TEXT PRIMARY KEY,
    subtotal REAL NOT NULL,
    isv REAL NOT NULL,
    total REAL NOT NULL,
    fecha TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id TEXT NOT NULL,
    producto_id TEXT NOT NULL,
    nombre_producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL CHECK(rol IN ('admin', 'operario')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

// Insertar datos iniciales si la tabla está vacía
const productCount = db.prepare("SELECT COUNT(*) as count FROM productos").get() as { count: number }

if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO productos (id, nombre, categoria, precio, stock, stock_minimo)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const initialProducts = [
    ["1", "Coca-Cola 600ml", "Bebidas", 25, 48, 10],
    ["2", "Leche Dos Pinos 1L", "Lácteos", 32, 24, 8],
    ["3", "Arroz Tío Pelón 1kg", "Granos", 28, 36, 12],
    ["4", "Pan Bimbo Blanco", "Panadería", 45, 15, 5],
    ["5", "Huevos Docena", "Lácteos", 65, 20, 8],
    ["6", "Frijoles Rojos 1kg", "Granos", 35, 30, 10],
    ["7", "Azúcar 1kg", "Abarrotes", 22, 25, 10],
    ["8", "Aceite Mazola 750ml", "Abarrotes", 85, 18, 6],
    ["9", "Jabón Protex", "Higiene", 28, 40, 15],
    ["10", "Papel Higiénico Scott 4pack", "Higiene", 55, 22, 8],
  ]

  const insertMany = db.transaction((products: (string | number)[][]) => {
    for (const product of products) {
      insertProduct.run(...product)
    }
  })

  insertMany(initialProducts)
}

// Insertar usuarios por defecto si no existen
const userCount = db.prepare("SELECT COUNT(*) as count FROM usuarios").get() as { count: number }

if (userCount.count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO usuarios (id, nombre, email, password, rol)
    VALUES (?, ?, ?, ?, ?)
  `)

  // Contraseñas en texto plano para demo (en producción usar bcrypt)
  insertUser.run("1", "Carlos Sierra", "admin@pulperia.hn", "admin123", "admin")
  insertUser.run("2", "María López", "operario@pulperia.hn", "operario123", "operario")
}

export default db
