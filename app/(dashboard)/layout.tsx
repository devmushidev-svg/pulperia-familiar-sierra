"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { StoreProvider } from "@/contexts/store-context"
import { Spinner } from "@/components/ui/spinner"

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
    // Redirect operators from restricted pages
    if (!isLoading && user && !isAdmin) {
      if (pathname === "/reportes" || pathname === "/configuracion") {
        router.push("/")
      }
    }
  }, [pathname, isLoading, user, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
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
