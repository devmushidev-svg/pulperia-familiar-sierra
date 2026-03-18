/**
 * Layout raíz. Envuelve la app con AppInitializer (splash en primera visita)
 * y define metadata e iconos.
 */

import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppInitializer } from '@/components/app-initializer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Pulpería Familiar Sierra - Sistema de Gestión',
  description: 'Sistema de gestión de ventas e inventario para Pulpería Familiar Sierra',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/logo-icono.png',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/images/logo-icono.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppInitializer>
          {children}
        </AppInitializer>
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
