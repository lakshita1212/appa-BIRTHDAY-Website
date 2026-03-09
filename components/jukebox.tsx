"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Music, ChevronUp, ChevronDown, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface Song {
  id: number
  title: string
  file: string
}

const songs: Song[] = [
  { id: 1, title: "Enamo Yedho", file: "/song1.mp3" },
  { id: 2, title: "Puthum Pudhu Kaalai", file: "/song2.mp3" },
]

export function Jukebox() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentSong = songs[currentSongIndex]

  // 1. IMPROVED AUTO-PLAY
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const attemptPlay = async () => {
      // We set the source explicitly to ensure it's ready
      audio.src = songs[0].file
      audio.load()
      audio.volume = volume / 100

      try {
        // We wait a tiny bit for the component to settle
        await new Promise(resolve => setTimeout(resolve, 100))
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        console.log("Autoplay blocked. Waiting for manual play or second click.")
        // If it fails, we keep isPlaying false so the user can click Play
        setIsPlaying(false)
      }
    }

    attemptPlay()

    return () => {
      audio.pause()
    }
  }, []) // Only runs once when Jukebox appears

  // 2. TRACK CHANGE
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isPlaying) return

    audio.src = currentSong.file
    audio.load()
    audio.play().catch(() => setIsPlaying(false))
  }, [currentSongIndex])

  // 3. LISTENERS
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTime = () => setCurrentTime(audio.currentTime)
    const handleMeta = () => setDuration(audio.duration)
    const handleEnd = () => nextSong()

    audio.addEventListener("timeupdate", handleTime)
    audio.addEventListener("loadedmetadata", handleMeta)
    audio.addEventListener("ended", handleEnd)

    return () => {
      audio.removeEventListener("timeupdate", handleTime)
      audio.removeEventListener("loadedmetadata", handleMeta)
      audio.removeEventListener("ended", handleEnd)
    }
  }, [])

  // 4. VOLUME
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const nextSong = () => setCurrentSongIndex((prev) => (prev + 1) % songs.length)
  const prevSong = () => setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00"
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`
  }

  return (
    <div className={cn(
      "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-full max-w-2xl px-4",
      isOpen ? "translate-y-0" : "translate-y-[calc(100%-64px)]"
    )}>
      <audio ref={audioRef} preload="auto" />
      
      <div className="rounded-t-3xl border border-white/20 bg-slate-900/90 backdrop-blur-xl p-4 shadow-2xl">
        {/* Header */}
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-3 pb-4">
          <div className={cn("w-10 h-10 rounded-full bg-zinc-800 border-2 border-[#00ced1] flex items-center justify-center", isPlaying && "animate-spin")}>
            <div className="w-2 h-2 rounded-full bg-[#00ced1]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#00ced1] text-xs font-bold uppercase">Appa's Jukebox</p>
            <p className="text-white text-sm truncate">{currentSong.title}</p>
          </div>
          {isOpen ? <ChevronDown className="text-white/50" /> : <ChevronUp className="text-white/50" />}
        </button>

        {/* Player Controls */}
        <div className="space-y-4 px-2">
          <div className="flex gap-2">
            {songs.map((s, i) => (
              <button 
                key={s.id} 
                onClick={() => { setCurrentSongIndex(i); setIsPlaying(true); }}
                className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", 
                  currentSongIndex === i ? "bg-[#00ced1] text-white" : "bg-white/10 text-white/40")}
              >
                {s.title}
              </button>
            ))}
          </div>

          <Slider 
            value={[currentTime]} 
            max={duration || 100} 
            onValueChange={(v) => { if(audioRef.current) audioRef.current.currentTime = v[0] }} 
          />
          
          <div className="flex justify-between text-[10px] text-white/50 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex justify-center items-center gap-6">
            <button onClick={prevSong} className="text-white/70"><SkipBack /></button>
            <button onClick={togglePlay} className="w-14 h-14 bg-[#00ced1] rounded-full flex items-center justify-center text-white shadow-lg">
              {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
            </button>
            <button onClick={nextSong} className="text-white/70"><SkipForward /></button>
          </div>
        </div>
      </div>
    </div>
  )
}