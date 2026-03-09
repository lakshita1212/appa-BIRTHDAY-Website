"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
  type: "square" | "circle" | "star"
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      "#00CED1", // electric turquoise
      "#FFD700", // gold
      "#FFFFFF", // white
      "#00CED1",
      "#FFD700",
      "#4ECDC4", // teal
    ]
    const types: ConfettiPiece["type"][] = ["square", "circle", "star"]

    const generated: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 12,
      type: types[Math.floor(Math.random() * types.length)],
    }))
    setPieces(generated)
  }, [])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-[confettiFall_linear_infinite]"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {piece.type === "square" && (
            <div
              style={{
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
                borderRadius: "2px",
                boxShadow: `0 0 10px ${piece.color}`,
              }}
            />
          )}
          {piece.type === "circle" && (
            <div
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: "50%",
                boxShadow: `0 0 10px ${piece.color}`,
              }}
            />
          )}
          {piece.type === "star" && (
            <svg
              width={piece.size}
              height={piece.size}
              viewBox="0 0 24 24"
              fill={piece.color}
              style={{ filter: `drop-shadow(0 0 6px ${piece.color})` }}
            >
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          )}
        </div>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(1080deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
