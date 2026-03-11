-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtotal DECIMAL(10,2) NOT NULL,
  isv DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Habilitar RLS pero permitir acceso publico para esta app de demo
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;

-- Politicas para permitir todas las operaciones (app de demo sin auth de Supabase)
CREATE POLICY "Allow all on productos" ON productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ventas" ON ventas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on detalle_ventas" ON detalle_ventas FOR ALL USING (true) WITH CHECK (true);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, categoria, precio, stock, stock_minimo) VALUES
  ('Coca-Cola 600ml', 'Bebidas', 25.00, 48, 10),
  ('Leche Sula 1L', 'Lacteos', 32.50, 24, 10),
  ('Arroz Progreso 1kg', 'Granos', 28.00, 36, 15),
  ('Pan Bimbo Blanco', 'Panaderia', 45.00, 18, 8),
  ('Huevos Docena', 'Lacteos', 65.00, 20, 10),
  ('Frijoles Naturas 400g', 'Granos', 22.00, 30, 12),
  ('Aceite Mazola 750ml', 'Aceites', 85.00, 15, 5),
  ('Azucar Cana Real 1kg', 'Granos', 18.00, 40, 15),
  ('Cafe Oro 200g', 'Bebidas', 55.00, 25, 8),
  ('Jabon Palmolive', 'Higiene', 28.00, 35, 10);
