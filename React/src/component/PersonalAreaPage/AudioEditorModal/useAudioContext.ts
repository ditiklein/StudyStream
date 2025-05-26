"use client"

import { useState } from "react"

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeAudioContext = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(ctx)
      return ctx
    }
    return audioContext
  }

  const loadAudioFromUrl = async (audioUrl: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const ctx = initializeAudioContext()
      const response = await fetch(audioUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()

      if (arrayBuffer.byteLength === 0) {
        throw new Error("Empty audio file")
      }

      const buffer = await ctx.decodeAudioData(arrayBuffer)

      if (!isFinite(buffer.duration) || buffer.duration <= 0) {
        throw new Error("Invalid audio duration")
      }

      setAudioBuffer(buffer)
      setIsLoading(false)

      return buffer
    } catch (err) {
      const errorMessage = `שגיאה בטעינת קובץ השמע: ${err instanceof Error ? err.message : "Unknown error"}`
      setError(errorMessage)
      setIsLoading(false)
      throw new Error(errorMessage)
    }
  }

  const cleanup = () => {
    if (audioContext) {
      audioContext.close()
      setAudioContext(null)
    }
    setAudioBuffer(null)
    setError(null)
  }

  return {
    audioContext,
    audioBuffer,
    setAudioBuffer,
    isLoading,
    error,
    loadAudioFromUrl,
    cleanup,
    setError,
  }
}
