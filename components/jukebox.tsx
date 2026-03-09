"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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

  // 1. AUTO-PLAY ON MOUNT (Triggered by isRevealed in page.tsx)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const playOnMount = async () => {
      try {
        audio.volume = volume / 100
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        console.log("Waiting for interaction to play")
      }
    }

    playOnMount()

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // 2. TRACK CHANGE LOGIC
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.load()
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [currentSongIndex])

  // 3. LISTENERS
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => nextSong()

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSongIndex, isPlaying])

  // 4. VOLUME SYNC
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

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    setIsPlaying(true)
  }

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <audio ref={audioRef} src={currentSong.file} preload="auto" />

      <div className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out w-full max-w-2xl px-4",
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-64px)]"
      )}>
        <div className="rounded-t-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900/85 backdrop-blur-xl"
          style={{ boxShadow: "0 -10px 60px rgba(0, 206, 209, 0.3)" }}>
          
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-center gap-3 py-4 px-6 hover:bg-white/5 transition-colors">
            <div className="relative w-10 h-10">
              <div className={cn("absolute inset-0 rounded-full bg-zinc-800 border-2 border-zinc-700", isPlaying && "animate-spin")} style={{ animationDuration: "3s" }}>
                <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#00ced1]" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[#00ced1] font-bold text-sm uppercase tracking-wider">Appa's Jukebox</p>
              <p className="text-white/70 text-xs truncate max-w-[200px]">{isPlaying ? `Playing: ${currentSong.title}` : "Paused"}</p>
            </div>
            <Music className="w-5 h-5 text-[#00ced1]" />
            {isOpen ? <ChevronDown className="w-5 h-5 text-white/50" /> : <ChevronUp className="w-5 h-5 text-white/50" />}
          </button>

          <div className="px-6 pb-6">
            <div className="flex gap-2 mb-6">
              {songs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => { setCurrentSongIndex(index); setIsPlaying(true); }}
                  className={cn("flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all",
                    currentSongIndex === index ? "bg-[#00ced1] text-white shadow-lg shadow-[#00ced1]/30" : "bg-white/10 text-white/70 hover:bg-white/20"
                  )}
                >
                  {song.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className={cn("relative w-20 h-20 flex-shrink-0 rounded-full bg-zinc-800 border-4 border-zinc-600 shadow-xl", isPlaying && "animate-spin")} style={{ animationDuration: "4s" }}>
                <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-[#00ced1]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg mb-1">{currentSong.title}</p>
                <Slider value={[currentTime]} min={0} max={duration || 100} step={0.1} onValueChange={(v) => audioRef.current && (audioRef.current.currentTime = v[0])} />
                <div className="flex justify-between text-[10px] text-white/50 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button onClick={prevSong} className="p-3 rounded-full bg-white/10 text-white hover:scale-110"><SkipBack /></button>
              <button onClick={togglePlay} className="p-5 rounded-full bg-[#00ced1] text-white shadow-lg hover:scale-110">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button onClick={nextSong} className="p-3 rounded-full bg-white/10 text-white hover:scale-110"><SkipForward /></button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/50 hover:text-white">
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>
              <Slider value={[isMuted ? 0 : volume]} min={0} max={100} onValueChange={(v) => setVolume(v[0])} className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}