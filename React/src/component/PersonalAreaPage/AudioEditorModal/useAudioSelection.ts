
import { useState, useCallback } from "react"

export const useAudioSelection = (duration: number) => {
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<"start" | "end" | null>(null)

  const handleSelectionStart = useCallback(
    (time: number) => {
      const startDiff = Math.abs(time - startTime)
      const endDiff = Math.abs(time - endTime)

      if (startDiff < endDiff && startDiff < duration * 0.05) {
        setDragType("start")
        setIsDragging(true)
      } else if (endDiff < duration * 0.05) {
        setDragType("end")
        setIsDragging(true)
      } else {
        setStartTime(time)
        setEndTime(time)
        setDragType("end")
        setIsDragging(true)
      }
    },
    [startTime, endTime, duration],
  )

  const handleSelectionMove = useCallback(
    (time: number) => {
      if (!isDragging || !dragType) return

      if (dragType === "start") {
        setStartTime(Math.max(0, Math.min(time, endTime - 0.1)))
      } else if (dragType === "end") {
        setEndTime(Math.max(startTime + 0.1, Math.min(time, duration)))
      }
    },
    [isDragging, dragType, startTime, endTime, duration],
  )

  const handleSelectionEnd = useCallback(() => {
    setIsDragging(false)
    setDragType(null)
  }, [])

  const resetSelection = useCallback(() => {
    setStartTime(0)
    setEndTime(duration)
    setIsDragging(false)
    setDragType(null)
  }, [duration])

  const isValidSelection = useCallback(() => {
    return (
      isFinite(startTime) &&
      isFinite(endTime) &&
      startTime < endTime &&
      startTime >= 0 &&
      endTime <= duration &&
      endTime - startTime >= 0.1
    )
  }, [startTime, endTime, duration])

  return {
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    isDragging,
    dragType,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    resetSelection,
    isValidSelection,
  }
}
