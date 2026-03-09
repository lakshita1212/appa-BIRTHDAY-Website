"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { BirthdayMessage } from "@/components/birthday-message"
import { PhotoGallery } from "@/components/photo-gallery"
import { Jukebox } from "@/components/jukebox"
import { Confetti } from "@/components/confetti"
import { FloatingElements } from "@/components/floating-elements"
import { ScrollReveal } from "@/components/scroll-reveal"
import { EntryScreen } from "@/components/entry-screen"
import { Heart, Star } from "lucide-react"

export default function BirthdayPage() {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <>
      {/* Phase 1: Entry Screen - This must be the ONLY thing rendered initially */}
      {!isRevealed ? (
        <EntryScreen onReveal={() => setIsRevealed(true)} />
      ) : (
        /* Phase 2: Main Site - Jukebox is now safely inside here */
        <main className="min-h-screen bg-background overflow-x-hidden animate-[fadeInZoom_1s_ease-out]">
          <Confetti />
          <FloatingElements />

          <HeroSection />
          <BirthdayMessage />

          <section className="py-20 md:py-32 px-6 relative">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-10"
              style={{
                background: "radial-gradient(ellipse, rgba(255,215,0,0.5) 0%, transparent 70%)",
              }}
            />

            <div className="max-w-6xl mx-auto relative">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-6 h-6 text-accent fill-accent" />
                    <Star className="w-8 h-8 text-primary fill-primary" />
                    <Star className="w-6 h-6 text-accent fill-accent" />
                  </div>
                  <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
                    CHERISHED MOMENTS
                  </h2>
                  <p className="text-muted-foreground text-lg md:text-xl font-semibold">
                    Our favorite memories with you
                  </p>
                </div>
              </ScrollReveal>
              <PhotoGallery />
            </div>
          </section>

          <footer className="py-20 px-6 text-center relative">
            <div
              className="absolute bottom-0 left-0 right-0 h-40 opacity-20"
              style={{
                background: "linear-gradient(to top, rgba(0,206,209,0.3), transparent)",
              }}
            />
            <ScrollReveal direction="up">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
                <Heart className="w-8 h-8 text-accent fill-accent animate-pulse" style={{ animationDelay: "0.2s" }} />
                <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <p className="font-display text-3xl md:text-4xl text-foreground mb-4">
                HAPPY BIRTHDAY, Appa!
              </p>
              <p className="text-muted-foreground text-lg font-semibold">
                Hope you have an awesome day!
              </p>
            </ScrollReveal>
          </footer>

          {/* Bottom padding and Jukebox */}
          <div className="h-24" />
          <Jukebox />

          <style jsx>{`
            @keyframes fadeInZoom {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </main>
      )}
    </>
  )
}