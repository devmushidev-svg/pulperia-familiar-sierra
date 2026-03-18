-- Migración: agregar created_at a ventas si no existe
-- Ejecutar en el SQL Editor de Supabase si ves "column ventas.created_at does not exist"

ALTER TABLE ventas ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
