# Pulpería Familiar Sierra - Documentación Técnica

Sistema de gestión de ventas e inventario para pulpería. Next.js 16, React 19, persistencia en Supabase (PostgreSQL en la nube).

---

## Configuración de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. En Settings → API copiar `Project URL` y `anon public` key
3. Crear `.env.local` con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```
4. En Supabase Dashboard → SQL Editor, ejecutar `scripts/001_create_tables.sql`
5. Si ves "column ventas.created_at does not exist", ejecutar `scripts/002_add_created_at_ventas.sql`

---

## Arquitectura

```
app/
├── layout.tsx          → Layout raíz, AppInitializer, metadata
├── login/
│   ├── layout.tsx      → AuthProvider, redirección si ya logueado
│   └── page.tsx        → Formulario login
└── (dashboard)/
    ├── layout.tsx      → AuthProvider, StoreProvider, sidebar, protección rutas
    ├── page.tsx        → Panel de control
    ├── productos/      → Catálogo e inventario
    ├── ventas/         → Punto de venta (POS)
    ├── reportes/       → Cierre de caja, gráficos, inventario (solo admin)
    └── configuracion/  → Opciones (solo admin)

lib/
├── database.ts         → Re-exporta capa Supabase
└── supabase-database.ts → Operaciones CRUD contra Supabase

contexts/
├── auth-context.tsx    → Usuario, login, logout, isAdmin
└── store-context.tsx   → Productos, ventas, CRUD, addSale
```

---

## Flujo de Datos

### Persistencia (lib/database.ts)
- **Tablas**: productos, ventas, detalle_ventas, usuarios
- **Inicialización**: Crea tablas en localStorage si no existen, inserta datos de ejemplo
- **Venta**: insertSale guarda en ventas + detalle_ventas y descuenta stock en productos

### Autenticación (contexts/auth-context.tsx)
- **Login**: Valida contra DEMO_USERS, guarda en localStorage
- **Roles**: admin (acceso total), operario (sin reportes ni configuración)
- **Protección**: Dashboard layout redirige a /login si no hay usuario

### Tienda (contexts/store-context.tsx)
- **Hidratación**: Al montar, carga async desde Supabase (refreshProducts, refreshSales)
- **Operaciones**: addProduct, updateProduct, deleteProduct, addSale (todas async)
- **addSale**: Persiste venta en la nube, actualiza stock, refresca productos y ventas

---

## Páginas y Procesos

| Página | Proceso |
|--------|---------|
| **Login** | Formulario → login() → localStorage + redirección a / |
| **Panel** | Tarjetas (productos, ventas día, ingresos, bajo inventario), gráfico 7 días, top productos, ventas recientes |
| **Productos** | Tabla con búsqueda, ProductDialog para crear/editar, deleteProduct |
| **Ventas** | POSForm agrega al carrito → ShoppingCart → SaleSummary → addSale → InvoiceModal |
| **Reportes** | Cierre de caja (ventas del día), gráficos (ventas por día, productos más vendidos), estado inventario |
| **Configuración** | Opciones de la tienda (solo admin) |

---

## Componentes Clave

| Componente | Función |
|------------|---------|
| **AppInitializer** | Muestra SplashScreen en primera visita por sesión |
| **SplashScreen** | Logo, barra de progreso, mensajes rotativos, onComplete |
| **CashRegisterClose** | Filtra ventas del día, calcula totales, modal detalle, impresión |
| **InvoiceModal** | Factura con HTML optimizado para impresora térmica 80mm |
| **InventoryReport** | products → estado (Óptimo/Bajo/Agotado) según stock vs stock_minimo |
| **DailySalesChart** | Ventas del mes agrupadas por día |
| **TopProductsReport** | Ventas del mes agrupadas por producto, top 5 |

---

## Credenciales de Prueba

- **Admin**: admin / admin123
- **Operario**: operario / operario123

---

## Tecnologías

- Next.js 16, React 19
- Tailwind CSS, Radix UI (shadcn/ui)
- Recharts (gráficos)
- Supabase (PostgreSQL en la nube)
