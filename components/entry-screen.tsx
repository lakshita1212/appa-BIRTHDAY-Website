"use client"

import { useState, useEffect, useCallback } from "react"

interface Balloon {
  id: number
  x: number
  color: string
  size: number
  speed: number
  wobble: number
  delay: number
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
}

interface Sparkle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
  opacity: number
}

interface EntryScreenProps {
  onReveal: () => void
}

export function EntryScreen({ onReveal }: EntryScreenProps) {
  const [isClicked, setIsClicked] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  // Generate sparkles only on client to avoid hydration mismatch
  useEffect(() => {
    setSparkles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
      }))
    )
  }, [])

  // Animate confetti physics
  useEffect(() => {
    if (confetti.length === 0) return

    const gravity = 0.25
    const friction = 0.99

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * friction,
            vy: p.vy + gravity,
            rotation: p.rotation + p.vx * 3,
          }))
          .filter((p) => p.y < window.innerHeight + 200)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [confetti.length])

  const handleClick = useCallback(() => {
    if (isClicked) return
    setIsClicked(true)

    // Create confetti explosion from center
    const colors = ["#00CED1", "#FFD700", "#FF6B6B", "#4ECDC4", "#FFFFFF", "#FF69B4", "#00BFFF"]
    const newConfetti: ConfettiPiece[] = Array.from({ length: 200 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 200 + Math.random() * 0.5
      const velocity = 8 + Math.random() * 20
      return {
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 10 + Math.random() * 20,
        rotation: Math.random() * 360,
      }
    })
    setConfetti(newConfetti)

    // Create balloons
    const balloonColors = ["#00CED1", "#FFD700", "#00CED1", "#FFD700", "#4ECDC4", "#FF69B4"]
    const newBalloons: Balloon[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
      size: 50 + Math.random() * 40,
      speed: 3 + Math.random() * 4,
      wobble: Math.random() * 20 - 10,
      delay: Math.random() * 1,
    }))
    setBalloons(newBalloons)

    // Show popup after a brief moment
    setTimeout(() => {
      setShowPopup(true)
    }, 500)
  }, [isClicked])

  const handleDismiss = useCallback(() => {
    setShowPopup(false)
    setIsTransitioning(true)
    setTimeout(onReveal, 800)
  }, [onReveal])

  // Auto-dismiss popup after 3 seconds
  useEffect(() => {
    if (!showPopup) return
    const timer = setTimeout(handleDismiss, 5000)
    return () => clearTimeout(timer)
  }, [showPopup, handleDismiss])

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-700 ${
        isTransitioning ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)",
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(0, 206, 209, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)",
        }}
      />

      {/* Floating sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
              opacity: sparkle.opacity,
            }}
          />
        ))}
      </div>

      {/* Main button - only show if not clicked */}
      {!isClicked && (
        <button
          onClick={handleClick}
          className="group relative px-12 py-8 md:px-20 md:py-12 rounded-3xl font-display text-2xl md:text-4xl uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
          style={{
            background: "linear-gradient(135deg, #FF6B6B 0%, #FF4757 50%, #FF6B6B 100%)",
            boxShadow:
              "0 0 60px rgba(255, 107, 107, 0.5), 0 0 120px rgba(255, 107, 107, 0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
          }}
        >
          <span className="relative z-10 drop-shadow-lg">{"DON'T CLICK THIS, Appa"}</span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
              style={{ animationTimingFunction: "ease-in-out" }}
            />
          </div>
        </button>
      )}

      {/* Confetti explosion */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[210]" aria-hidden="true">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute"
              style={{
                left: piece.x,
                top: piece.y,
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
                borderRadius: "4px",
                transform: `rotate(${piece.rotation}deg)`,
                boxShadow: `0 0 15px ${piece.color}80`,
              }}
            />
          ))}
        </div>
      )}

      {/* Balloons rising */}
      {balloons.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[205] overflow-hidden" aria-hidden="true">
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              className="absolute animate-[balloonRise_6s_ease-out_forwards]"
              style={{
                left: `${balloon.x}%`,
                bottom: "-150px",
                animationDelay: `${balloon.delay}s`,
              }}
            >
              {/* Balloon body */}
              <div
                className="relative animate-[wobble_2s_ease-in-out_infinite]"
                style={{
                  width: balloon.size,
                  height: balloon.size * 1.2,
                  backgroundColor: balloon.color,
                  borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  boxShadow: `inset -10px -10px 30px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.3), 0 0 30px ${balloon.color}50`,
                  animationDelay: `${balloon.wobble * 0.1}s`,
                }}
              >
                {/* Shine */}
                <div
                  className="absolute top-3 left-3 w-4 h-4 rounded-full bg-white/40"
                  style={{ filter: "blur(2px)" }}
                />
              </div>
              {/* String */}
              <div
                className="mx-auto w-0.5 bg-white/30"
                style={{
                  height: 40 + Math.random() * 30,
                  transform: `rotate(${balloon.wobble}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center px-4"
          onClick={handleDismiss}
        >
          <div
            className="relative bg-card p-10 md:p-16 rounded-3xl shadow-2xl text-center animate-[popIn_0.6s_ease-out] max-w-xl border-2 border-primary/30"
            style={{
              boxShadow:
                "0 0 80px rgba(0, 206, 209, 0.5), 0 0 160px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(0, 206, 209, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated cake */}
            <div className="text-7xl md:text-8xl mb-8 animate-bounce">
              🎂
            </div>
            <h2
              className="font-display text-4xl md:text-6xl text-primary mb-6"
              style={{ textShadow: "0 0 30px rgba(0, 206, 209, 0.6)" }}
            >
              HAPPY BIRTHDAY!
            </h2>
            <p className="text-xl md:text-2xl text-foreground font-bold mb-3">
              I told you not to click it, Appa
            </p>
            
            <button
              onClick={handleDismiss}
              className="mt-8 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg uppercase tracking-wider rounded-xl hover:scale-105 transition-transform"
              style={{ boxShadow: "0 0 30px rgba(0, 206, 209, 0.4)" }}
            >
              See Your Surprise
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              (or wait 5 seconds)
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes popIn {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes balloonRise {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-120vh); opacity: 0.8; }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-5deg) translateX(-5px); }
          50% { transform: rotate(5deg) translateX(5px); }
        }
      `}</style>
    </div>
  )
}
