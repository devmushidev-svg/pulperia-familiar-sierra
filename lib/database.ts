/**
 * Capa de persistencia con Supabase (PostgreSQL en la nube).
 *
 * Productos y ventas se almacenan en Supabase. Requiere NEXT_PUBLIC_SUPABASE_URL
 * y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local. Ejecutar scripts/001_create_tables.sql
 * en el SQL Editor de Supabase antes de usar.
 */

import * as supabase from "./supabase-database"

export type { Product, Sale, SaleDetail, CartItem, SaleWithItems } from "./supabase-database"

export const db = {
  init: supabase.initDatabase,
  selectAllProducts: supabase.selectAllProducts,
  selectProductById: supabase.selectProductById,
  insertProduct: supabase.insertProduct,
  updateProduct: supabase.updateProduct,
  deleteProduct: supabase.deleteProduct,
  selectAllSales: supabase.selectAllSales,
  selectSaleDetails: supabase.selectSaleDetails,
  insertSale: supabase.insertSale,
  selectAllSalesWithDetails: supabase.selectAllSalesWithDetails,
  getSchema: supabase.getSchema,
  executeQuery: supabase.executeQuery,
}
