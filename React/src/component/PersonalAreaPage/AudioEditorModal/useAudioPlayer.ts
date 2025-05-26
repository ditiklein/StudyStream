"use client"

import { useState, useRef, useEffect } from "react"

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number>(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)

  const updateCurrentTime = () => {
    const audio = audioRef.current
    if (audio && isPlaying) {
      setCurrentTime(audio.currentTime)
    }
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateCurrentTime)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateCurrentTime)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        if (audio.readyState >= 2) {
          await audio.play()
        } else {
          throw new Error("השמע עדיין לא נטען")
        }
      }
    } catch (err) {
      console.error("Play error:", err)
      throw new Error("שגיאה בהפעלת השמע")
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setCurrentTime(0)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
    }
  }

  const updateAudioSource = (newUrl: string) => {
    const audio = audioRef.current
    if (audio) {
      audio.src = newUrl
      audio.load()
    }
  }

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }

  return {
    audioRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    handlePlayPause,
    handleStop,
    handleTimeUpdate,
    updateAudioSource,
    cleanup,
  }
}
