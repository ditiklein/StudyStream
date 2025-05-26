
import { useState } from "react"

// הגדרת types עבור lamejs על window
declare global {
  interface Window {
    lamejs: {
      Mp3Encoder: new (
        channels: number,
        sampleRate: number,
        bitRate: number,
      ) => {
        encodeBuffer: (left: Int16Array, right?: Int16Array) => Uint8Array
        flush: () => Uint8Array
      }
    }
  }
}

export const useAudioProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const isLamejsAvailable = () => {
    return typeof window !== "undefined" && window.lamejs && window.lamejs.Mp3Encoder
  }

  const getFileFormat = (fileName: string): string => {
    const extension = fileName?.split(".").pop()?.toLowerCase()
    return extension || "wav"
  }

  const audioBufferToMp3 = (audioBuffer: AudioBuffer, bitRate = 128): ArrayBuffer => {
    if (!isLamejsAvailable()) {
      throw new Error("lamejs library not available")
    }

    try {
      const sampleRate = audioBuffer.sampleRate
      const numChannels = audioBuffer.numberOfChannels

      const mp3encoder = new window.lamejs.Mp3Encoder(numChannels, sampleRate, bitRate)
      const mp3Data: Uint8Array[] = []

      if (numChannels === 1) {
        const channelData = audioBuffer.getChannelData(0)
        const samples = new Int16Array(audioBuffer.length)

        for (let i = 0; i < audioBuffer.length; i++) {
          samples[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32767))
        }

        const mp3buf = mp3encoder.encodeBuffer(samples)
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf)
        }
      } else {
        const left = audioBuffer.getChannelData(0)
        const right = audioBuffer.getChannelData(1)
        const leftSamples = new Int16Array(audioBuffer.length)
        const rightSamples = new Int16Array(audioBuffer.length)

        for (let i = 0; i < audioBuffer.length; i++) {
          leftSamples[i] = Math.max(-32768, Math.min(32767, left[i] * 32767))
          rightSamples[i] = Math.max(-32768, Math.min(32767, right[i] * 32767))
        }

        const mp3buf = mp3encoder.encodeBuffer(leftSamples, rightSamples)
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf)
        }
      }

      const mp3buf = mp3encoder.flush()
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf)
      }

      const totalLength = mp3Data.reduce((acc, buf) => acc + buf.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0

      for (const buf of mp3Data) {
        result.set(buf, offset)
        offset += buf.length
      }

      return result.buffer
    } catch (err) {
      console.error("MP3 encoding error:", err)
      throw new Error("שגיאה בהמרה ל-MP3")
    }
  }

  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length
    const numberOfChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
    const view = new DataView(arrayBuffer)

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + length * numberOfChannels * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    view.setUint16(32, numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, length * numberOfChannels * 2, true)

    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i]
        const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff
        view.setInt16(offset, intSample, true)
        offset += 2
      }
    }

    return arrayBuffer
  }

  const cutAudio = async (
    audioBuffer: AudioBuffer,
    audioContext: AudioContext,
    startTime: number,
    endTime: number,
  ): Promise<AudioBuffer> => {
    setIsProcessing(true)

    try {
      const sampleRate = audioBuffer.sampleRate
      const startSample = Math.floor(startTime * sampleRate)
      const endSample = Math.floor(endTime * sampleRate)
      const newLength = endSample - startSample

      const newBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, newLength, sampleRate)

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const oldData = audioBuffer.getChannelData(channel)
        const newData = newBuffer.getChannelData(channel)
        for (let i = 0; i < newLength; i++) {
          newData[i] = oldData[startSample + i]
        }
      }

      return newBuffer
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteAudio = async (
    audioBuffer: AudioBuffer,
    audioContext: AudioContext,
    startTime: number,
    endTime: number,
  ): Promise<AudioBuffer> => {
    setIsProcessing(true)

    try {
      const sampleRate = audioBuffer.sampleRate
      const startSample = Math.floor(startTime * sampleRate)
      const endSample = Math.floor(endTime * sampleRate)

      const beforeLength = startSample
      const afterLength = audioBuffer.length - endSample
      const newLength = beforeLength + afterLength

      if (newLength <= 0) {
        throw new Error("לא ניתן למחוק את כל השמע")
      }

      const newBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, newLength, sampleRate)

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const oldData = audioBuffer.getChannelData(channel)
        const newData = newBuffer.getChannelData(channel)

        for (let i = 0; i < beforeLength; i++) {
          newData[i] = oldData[i]
        }

        for (let i = 0; i < afterLength; i++) {
          newData[beforeLength + i] = oldData[endSample + i]
        }
      }

      return newBuffer
    } finally {
      setIsProcessing(false)
    }
  }

  const convertToFormat = (audioBuffer: AudioBuffer, fileName: string): { data: ArrayBuffer; mimeType: string } => {
    const originalFormat = getFileFormat(fileName)

    if (originalFormat === "mp3" && isLamejsAvailable()) {
      return {
        data: audioBufferToMp3(audioBuffer),
        mimeType: "audio/mpeg",
      }
    } else {
      return {
        data: audioBufferToWav(audioBuffer),
        mimeType: "audio/wav",
      }
    }
  }

  return {
    isProcessing,
    isLamejsAvailable,
    getFileFormat,
    audioBufferToMp3,
    audioBufferToWav,
    cutAudio,
    deleteAudio,
    convertToFormat,
  }
}
