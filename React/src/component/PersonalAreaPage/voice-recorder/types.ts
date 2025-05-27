export interface Id {
  parentId: number | null
}

export interface VoiceRecorderState {
  recording: boolean
  paused: boolean
  audioBlob: Blob | null
  audioUrl: string | null
  recordingTime: number
  waveformValues: number[]
  lessonName: string
  files: File[]
  uploadProgress: number
  selectedFiles: File[]
  isDialogOpen: boolean
  isVisible: boolean
  transcriptionEnabled: boolean
  currentTranscript: string
  finalTranscript: string
  isTranscriptionSupported: boolean
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}
