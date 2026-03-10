"use client"

import { useEffect } from "react"
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
      <div className="flex h-screen w-full items-center justify-center bg-background">
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
