"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "operario"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing - in production this would be from a database
const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@pulperia.hn",
    password: "admin123",
    user: {
      id: "1",
      name: "Carlos Sierra",
      email: "admin@pulperia.hn",
      role: "admin",
    },
  },
  {
    email: "operario@pulperia.hn",
    password: "operario123",
    user: {
      id: "2",
      name: "María López",
      email: "operario@pulperia.hn",
      role: "operario",
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
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
