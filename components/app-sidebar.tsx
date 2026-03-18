"use client"

/**
 * Barra lateral de navegación. Logo, menú (Panel, Productos, Ventas, Reportes,
 * Configuración). Operarios no ven Reportes ni Configuración. Footer con usuario
 * y logout.
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const menuItems = [
  {
    title: "Panel de Control",
    url: "/",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    title: "Productos",
    url: "/productos",
    icon: Package,
    adminOnly: false,
  },
  {
    title: "Ventas",
    url: "/ventas",
    icon: ShoppingCart,
    adminOnly: false,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
    adminOnly: true,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || isAdmin
  )

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="/images/logo-icono.png"
              alt="Pulpería Familiar Sierra"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-sidebar-foreground truncate">Pulpería Familiar</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">Sierra</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
            {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2) || "US"}
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">{user?.name || "Usuario"}</span>
            <span className="text-xs text-sidebar-foreground/70">
              {isAdmin ? "Administrador" : "Operario"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
