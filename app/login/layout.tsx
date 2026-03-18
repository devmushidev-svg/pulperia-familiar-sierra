"use client"

/**
 * Layout de login. AuthProvider envuelve el contenido. Si hay usuario logueado
 * redirige a /. Mientras carga auth muestra logo y spinner.
 */

import { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

function LoginLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background">
        <Image
          src="/images/logo-icono.png"
          alt="Pulpería Familiar Sierra"
          width={72}
          height={72}
          className="object-contain opacity-90"
        />
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return <>{children}</>
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <LoginLayoutContent>{children}</LoginLayoutContent>
    </AuthProvider>
  )
}
