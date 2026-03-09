"use client"

import { ScrollReveal } from "./scroll-reveal"

export function HeroSection() {
  return (
    <section className="relative w-full bg-background flex flex-col items-center">
      {/* THE IMAGE CONTAINER */}
      <div className="relative w-full">
        <img
          src="/images/hero.jpg"
          alt="Birthday celebration with Appa"
          className="w-full h-auto block" // h-auto ensures the full picture is shown
        />
        
        {/* Top Overlay: Darker at the very top to make white text readable against sky */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

        {/* Bottom Overlay: Blends the photo into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* CONTENT BOX - MOVED TO THE TOP */}
        <div className="absolute inset-x-0 top-0 z-10 text-center px-6 pt-10 md:pt-20 max-w-5xl mx-auto">
          <ScrollReveal direction="down" delay={200}>
            <div className="inline-block bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <p
                className="text-[#00ced1] font-black text-xs md:text-sm uppercase tracking-[0.5em] mb-4"
                style={{ textShadow: "0 0 15px rgba(0,206,209,0.8)" }}
              >
                Celebrating The Greatest Appa
              </p>
              
              <h1
                className="font-black text-4xl sm:text-6xl md:text-8xl text-white mb-4 leading-none tracking-tighter"
                style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
              >
                HAPPY <span className="text-[#00ced1]">BIRTHDAY</span>
                <br />
                APPA!
              </h1>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-1 w-12 bg-[#00ced1] rounded-full" />
                <div className="h-2 w-2 bg-white rounded-full animate-ping" />
                <div className="h-1 w-12 bg-[#00ced1] rounded-full" />
              </div>

              <p className="text-white text-lg md:text-2xl font-bold">
                ~ 1971 ~
                <br />
                <span className="text-[#00ced1] uppercase tracking-wider">
                  Imported from India
                </span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Spacer for the next section */}
      <div className="h-12 w-full bg-background" />
    </section>
  )
}