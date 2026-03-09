"use client"

import { Heart } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

export function BirthdayMessage() {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
        style={{
          background: "radial-gradient(ellipse, rgba(0,206,209,0.5) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <ScrollReveal direction="up">
          <div
            className="bg-card rounded-3xl p-10 md:p-16 shadow-2xl border border-border relative overflow-hidden"
            style={{
              boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,206,209,0.1)",
            }}
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-accent rounded-br-3xl" />

            <div className="text-center mb-10">
              <Heart className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
              <h2
                className="font-display text-3xl md:text-5xl text-foreground mb-4"
                style={{ textShadow: "0 0 30px rgba(0,206,209,0.3)" }}
              >
                A Message to Appa
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <div className="h-1 w-8 bg-accent rounded-full" />
                <div className="h-1 w-12 bg-primary rounded-full" />
              </div>
            </div>

            <div className="space-y-6 text-foreground/90 text-lg md:text-xl leading-relaxed font-medium">
              <p>
                Happy Birthday appa! I hope you have an amazing day! Thank you for being the best dad and for all the years of fun. 
              </p>
              <p>
                Thanks for always being there to support me and guiding me whenever I need it. I appreciate everything you do and I am also so proud of you!!</p>
              <p className="text-primary font-bold text-xl md:text-2xl">
                Hope you enjoyed this little gift because I know you have no idea where the previous birthday cards are. So I decided to make a little corner on the internet for you. You won't be able to lose this one. 
              </p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-border" />
              <span className="text-accent font-bold text-xl uppercase tracking-wider">have a nice day!</span>
              <div className="h-px w-16 bg-border" />
            </div>
          </div>
        </ScrollReveal>


      </div>
    </section>
  )
}
