"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Store, Bell, Shield, Printer } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Store className="h-5 w-5 text-primary" />
            Información del Negocio
          </CardTitle>
          <CardDescription>Datos generales de tu pulpería</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="business-name">Nombre del Negocio</Label>
            <Input id="business-name" defaultValue="Pulpería Familiar Sierra" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="owner">Propietario</Label>
            <Input id="owner" defaultValue="Familia Sierra" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" defaultValue="+506 8888-8888" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" defaultValue="pulperia@sierra.cr" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" defaultValue="San José, Costa Rica" />
          </div>
          <div className="pt-2">
            <Button>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Bell className="h-5 w-5 text-primary" />
            Notificaciones
          </CardTitle>
          <CardDescription>Configura las alertas del sistema</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Alertas de Bajo Inventario</span>
              <span className="text-xs text-muted-foreground">
                Notificar cuando un producto tenga stock bajo
              </span>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Resumen Diario de Ventas</span>
              <span className="text-xs text-muted-foreground">
                Enviar un resumen al final del día
              </span>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Alertas de Productos Agotados</span>
              <span className="text-xs text-muted-foreground">
                Notificar inmediatamente cuando un producto se agote
              </span>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Seguridad
            </CardTitle>
            <CardDescription>Opciones de seguridad de la cuenta</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Autenticación de dos factores</span>
                <span className="text-xs text-muted-foreground">
                  Añade una capa extra de seguridad
                </span>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="current-password">Cambiar Contraseña</Label>
              <Input id="current-password" type="password" placeholder="Contraseña actual" />
              <Input type="password" placeholder="Nueva contraseña" />
              <Input type="password" placeholder="Confirmar nueva contraseña" />
            </div>
            <Button variant="outline">Actualizar Contraseña</Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Printer className="h-5 w-5 text-primary" />
              Impresión
            </CardTitle>
            <CardDescription>Configuración de recibos e impresión</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Imprimir recibo automáticamente</span>
                <span className="text-xs text-muted-foreground">
                  Imprimir después de cada venta
                </span>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Incluir logo en recibos</span>
                <span className="text-xs text-muted-foreground">
                  Mostrar el logo del negocio
                </span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="footer-message">Mensaje en Recibo</Label>
              <Input id="footer-message" defaultValue="¡Gracias por su compra!" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
