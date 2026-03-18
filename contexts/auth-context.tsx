"use client"

/**
 * Contexto de autenticación.
 *
 * Proceso: Al cargar, lee usuario de localStorage. login valida contra DEMO_USERS,
 * guarda en estado y localStorage. logout limpia y redirige a /login. isAdmin
 * determina acceso a reportes y configuración.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "operario"

export type User = {
  id: string
  name: string
  username: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: { username: string; password: string; user: User }[] = [
  {
    username: "admin",
    password: "admin123",
    user: {
      id: "1",
      name: "Carlos Sierra",
      username: "admin",
      role: "admin",
    },
  },
  {
    username: "operario",
    password: "operario123",
    user: {
      id: "2",
      name: "Maria Lopez",
      username: "operario",
      role: "operario",
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("pulperia_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("pulperia_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    )

    if (found) {
      setUser(found.user)
      localStorage.setItem("pulperia_user", JSON.stringify(found.user))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pulperia_user")
    router.push("/login")
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
