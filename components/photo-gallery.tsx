"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const photos = [
  { src: "/images/photo-1.jpg", alt: "Best smile ever", caption: "Best smile ever" },
  { src: "/images/photo-2.jpg", alt: "Appa pic", caption: "At the temple" },
  { src: "/images/photo-3.jpg", alt: "Appa pic", caption: "Walks on Powder Mill Terrace" },
  { src: "/images/photo-4.jpg", alt: "Appa pic", caption: "Lake Parsippany" },
  { src: "/images/photo-5.jpg", alt: "Appa pic", caption: "25th Anniversary Surprise" },
  { src: "/images/photo-6.jpg", alt: "Appa pic", caption: "At the gym" },
  { src: "/images/photo-7.jpg", alt: "Appa pic", caption: "Saturday morning family calls" },
  { src: "/images/photo-8.jpg", alt: "Appa pic", caption: "Train to NYC" },
]

export function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Generate random rotations for each photo (memoized to stay consistent)
  const rotations = useMemo(
    () => photos.map(() => (Math.random() - 0.5) * 12),
    []
  )

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === 0 ? photos.length - 1 : lightboxIndex - 1)
  }

  const goToNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === photos.length - 1 ? 0 : lightboxIndex + 1)
  }

  return (
    <>
      {/* Scattered Polaroid Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {photos.map((photo, index) => (
          <ScrollReveal
            key={photo.src}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={index * 100}
          >
            <button
              onClick={() => openLightbox(index)}
              className="group relative block w-full focus:outline-none focus:ring-4 focus:ring-primary rounded-lg"
              aria-label={`View photo: ${photo.alt}`}
              style={{
                transform: `rotate(${rotations[index]}deg)`,
              }}
            >
              {/* Polaroid frame */}
              <div
                className="relative bg-white p-3 pb-14 rounded-lg shadow-xl transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:shadow-2xl group-hover:z-10"
                style={{
                  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                }}
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Caption (handwritten style) */}
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <p
                    className="text-zinc-700 font-semibold text-sm"
                    style={{ fontFamily: "cursive" }}
                  >
                    {photo.caption}
                  </p>
                </div>

                {/* Tape effect */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-accent/50 rounded-sm opacity-80"
                  style={{
                    transform: `translateX(-50%) rotate(${Math.random() * 10 - 5}deg)`,
                  }}
                />
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            className="absolute top-6 right-6 text-foreground p-3 rounded-full bg-card/50 hover:bg-card transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            className="absolute left-6 text-foreground p-3 rounded-full bg-card/50 hover:bg-card transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-6 text-foreground p-3 rounded-full bg-card/50 hover:bg-card transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Large polaroid in lightbox */}
          <div
            className="relative bg-white p-4 md:p-6 pb-16 md:pb-20 rounded-xl shadow-2xl max-w-3xl mx-auto animate-[popIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].alt}
              width={800}
              height={600}
              className="object-contain max-h-[60vh] w-auto mx-auto rounded-sm"
            />
            <p
              className="absolute bottom-4 md:bottom-6 left-0 right-0 text-center text-zinc-700 font-bold text-xl md:text-2xl"
              style={{ fontFamily: "cursive" }}
            >
              {photos[lightboxIndex].caption}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.9) rotate(-2deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </>
  )
}
