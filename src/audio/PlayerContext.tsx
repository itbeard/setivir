import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Song } from '../types'
import { assetUrl } from '../lib/assets'

interface PlayerValue {
  current: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  /** Play this song, or toggle play/pause if it is already the current one. */
  toggle: (song: Song) => void
  pause: () => void
  seek: (seconds: number) => void
  isCurrent: (song: Song) => boolean
}

const PlayerContext = createContext<PlayerValue | null>(null)

/** A play() promise rejected by a quick src switch — not a genuine error. */
function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Create the single shared <audio> element once.
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      audio.currentTime = 0
      setCurrentTime(0)
    }
    const onError = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [])

  // Toggle a root class so the layout can reserve space for the mini-player.
  useEffect(() => {
    document.documentElement.classList.toggle('has-track', current !== null)
  }, [current])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(
    (song: Song) => {
      const audio = audioRef.current
      if (!audio) return

      const sameTrack = current?.id === song.id
      if (sameTrack) {
        if (audio.paused) {
          void audio.play().catch((err) => {
          // Switching src aborts the prior play() — that's not a real failure.
          if (!isAbortError(err)) setIsPlaying(false)
        })
        } else {
          audio.pause()
        }
        return
      }

      // Switch to a new track.
      audio.src = assetUrl(song.audio)
      audio.currentTime = 0
      setCurrent(song)
      setCurrentTime(0)
      setDuration(0)
      void audio.play().catch(() => setIsPlaying(false))
    },
    [current],
  )

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }, [])

  const isCurrent = useCallback(
    (song: Song) => current?.id === song.id,
    [current],
  )

  const value = useMemo<PlayerValue>(
    () => ({ current, isPlaying, currentTime, duration, toggle, pause, seek, isCurrent }),
    [current, isPlaying, currentTime, duration, toggle, pause, seek, isCurrent],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer(): PlayerValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider>')
  return ctx
}

/** Format seconds as m:ss. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
