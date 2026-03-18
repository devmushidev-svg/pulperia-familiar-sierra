"use client"

/**
 * Layout del dashboard. AuthProvider + StoreProvider. Si no hay usuario redirige
 * a /login. Operarios no pueden acceder a /reportes ni /configuracion. Sidebar
 * + contenido principal.
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { StoreProvider, useStore } from "@/contexts/store-context"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

const pageNames: Record<string, string> = {
  "/": "Panel de Control",
  "/productos": "Productos",
  "/ventas": "Ventas",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, isAdmin } = useAuth()
  const currentPage = pageNames[pathname] || "Panel de Control"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      if (pathname === "/reportes" || pathname === "/configuracion") {
        router.push("/")
      }
    }
  }, [pathname, isLoading, user, isAdmin, router])

  const { error } = useStore()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background">
        <Image
          src="/images/logo-icono.png"
          alt="Pulpería Familiar Sierra"
          width={80}
          height={80}
          className="object-contain opacity-90"
        />
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>
              {error}. Verifica que Supabase esté configurado en .env.local y que hayas ejecutado
              scripts/001_create_tables.sql en el SQL Editor de Supabase.
            </AlertDescription>
          </Alert>
        )}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold text-card-foreground">{currentPage}</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <StoreProvider>
        <DashboardContent>{children}</DashboardContent>
      </StoreProvider>
    </AuthProvider>
  )
}
