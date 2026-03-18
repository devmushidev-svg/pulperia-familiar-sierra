"use client"

/**
 * Controla la pantalla de carga inicial.
 *
 * Proceso: En la primera visita de la sesión muestra SplashScreen. Al completar,
 * guarda en sessionStorage y renderiza children. En visitas posteriores omite
 * el splash.
 */

import { useState, useEffect } from "react"
import { SplashScreen } from "./splash-screen"

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("pulperia_splash_seen")
    if (hasSeenSplash) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem("pulperia_splash_seen", "true")
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} minDuration={2800} />
  }

  return <>{children}</>
}
