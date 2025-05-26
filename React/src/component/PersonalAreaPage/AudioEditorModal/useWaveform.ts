import { useRef, useCallback } from "react"

export const useWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawWaveform = useCallback((buffer: AudioBuffer) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const width = (canvas.width = canvas.offsetWidth)
    const height = (canvas.height = 150)

    ctx.clearRect(0, 0, width, height)

    const data = buffer.getChannelData(0)
    const step = Math.ceil(data.length / width)
    const amp = height / 2

    ctx.fillStyle = "#e91e63"
    ctx.beginPath()

    for (let i = 0; i < width; i++) {
      let min = 1.0
      let max = -1.0

      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j]
        if (datum < min) min = datum
        if (datum > max) max = datum
      }

      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp))
    }
  }, [])

  const drawSelectedRegion = useCallback(
    (audioBuffer: AudioBuffer | null, startTime: number, endTime: number, currentTime: number, duration: number) => {
      const canvas = canvasRef.current
      if (!canvas || !isFinite(duration) || duration <= 0) return

      const ctx = canvas.getContext("2d")!
      const width = canvas.width
      const height = canvas.height

      if (audioBuffer) {
        drawWaveform(audioBuffer)
      }

      // Draw selected region
      if (startTime < endTime && isFinite(startTime) && isFinite(endTime)) {
        const startX = (startTime / duration) * width
        const endX = (endTime / duration) * width

        ctx.fillStyle = "rgba(255, 87, 34, 0.3)"
        ctx.fillRect(startX, 0, endX - startX, height)

        ctx.strokeStyle = "#ff5722"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(startX, 0)
        ctx.lineTo(startX, height)
        ctx.moveTo(endX, 0)
        ctx.lineTo(endX, height)
        ctx.stroke()
      }

      // Draw current time indicator
      if (isFinite(currentTime) && currentTime >= 0 && currentTime <= duration) {
        const currentX = (currentTime / duration) * width

        ctx.strokeStyle = "#2196f3"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(currentX, 0)
        ctx.lineTo(currentX, height)
        ctx.stroke()
      }
    },
    [drawWaveform],
  )

  const getTimeFromX = useCallback((x: number, duration: number) => {
    const canvas = canvasRef.current
    if (!canvas || !duration) return 0
    const rect = canvas.getBoundingClientRect()
    const relativeX = x - rect.left
    const ratio = relativeX / canvas.offsetWidth
    return Math.max(0, Math.min(duration, ratio * duration))
  }, [])

  return {
    canvasRef,
    drawWaveform,
    drawSelectedRegion,
    getTimeFromX,
  }
}
