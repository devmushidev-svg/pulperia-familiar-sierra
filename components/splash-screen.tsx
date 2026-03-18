"use client"

/**
 * Pantalla de carga inicial.
 *
 * Proceso: Muestra logo, barra de progreso animada y mensajes rotativos (Conectando,
 * Cargando inventario, etc.). Tras minDuration llama onComplete. Usado por
 * AppInitializer en la primera visita por sesión.
 */

import { useState, useEffect } from "react"
import Image from "next/image"

const LOADING_STEPS = [
  "Conectando al servidor...",
  "Cargando inventario...",
  "Verificando productos...",
  "Preparando sistema de ventas...",
  "Sincronizando datos...",
  "Listo para comenzar...",
]

type SplashScreenProps = {
  onComplete?: () => void
  minDuration?: number
}

export function SplashScreen({ onComplete, minDuration = 2500 }: SplashScreenProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = minDuration / LOADING_STEPS.length
    const progressInterval = 50

    const stepTimer = setInterval(() => {
      setStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepTimer)
          return prev
        }
        return prev + 1
      })
    }, stepInterval)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, progressInterval)

    const completeTimer = setTimeout(() => {
      setProgress(100)
      setStep(LOADING_STEPS.length - 1)
      onComplete?.()
    }, minDuration)

    return () => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [minDuration, onComplete])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-black to-black" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 animate-in fade-in zoom-in-95 duration-700">
          <Image
            src="/images/logo-con-letras.png"
            alt="Pulpería Familiar Sierra"
            width={280}
            height={140}
            className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            priority
          />
        </div>

        <div className="w-72 max-w-[90vw] space-y-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <p className="min-h-[1.5rem] text-center text-sm font-medium text-emerald-400/90 animate-in fade-in duration-300">
            {LOADING_STEPS[Math.min(step, LOADING_STEPS.length - 1)]}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-2 w-2 rounded-full bg-emerald-500/20 animate-pulse" />
        <div className="absolute right-1/3 top-1/2 h-1 w-1 rounded-full bg-emerald-400/30 animate-pulse [animation-delay:300ms]" />
        <div className="absolute bottom-1/3 left-1/2 h-2 w-2 rounded-full bg-emerald-600/15 animate-pulse [animation-delay:500ms]" />
      </div>
    </div>
  )
}
