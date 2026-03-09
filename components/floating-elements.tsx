"use client"

import { useEffect, useState, useCallback } from "react"
import { Cake, Star, PartyPopper, Gift } from "lucide-react"

interface FloatingItem {
  id: number
  Icon: typeof Cake
  x: number
  y: number
  size: number
  rotation: number
  parallaxFactor: number
  color: string
}

export function FloatingElements() {
  const [items, setItems] = useState<FloatingItem[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const icons = [Cake, Star, PartyPopper, Gift]
    const colors = [
      "#00CED1", // turquoise
      "#FFD700", // gold
      "#00CED1",
      "#FFD700",
      "#FFFFFF", // white
    ]

    const generated: FloatingItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
      parallaxFactor: 0.02 + Math.random() * 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setItems(generated)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  if (items.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {items.map((item) => {
        const offsetX = mousePos.x * item.parallaxFactor * 100
        const offsetY = mousePos.y * item.parallaxFactor * 100

        return (
          <div
            key={item.id}
            className="absolute transition-transform duration-300 ease-out opacity-30"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${item.rotation}deg)`,
            }}
          >
            <item.Icon
              style={{
                width: item.size,
                height: item.size,
                color: item.color,
                filter: "drop-shadow(0 0 10px currentColor)",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
