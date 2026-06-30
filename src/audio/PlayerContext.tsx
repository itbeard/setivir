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
  /** Stop playback and dismiss the mini-player entirely. */
  close: () => void
  seek: (seconds: number) => void
  isCurrent: (song: Song) => boolean
  /** The live frequency analyser, for beat-reactive visuals. Null until first play. */
  getAnalyser: () => AnalyserNode | null
}

const PlayerContext = createContext<PlayerValue | null>(null)

/** A play() promise rejected by a quick src switch — not a genuine error. */
function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Web Audio graph for the beat-reactive cover visual, built lazily on first play.
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
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
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        void audioCtxRef.current.close()
      }
      audioCtxRef.current = null
      analyserRef.current = null
      sourceRef.current = null
    }
  }, [])

  // Wire the shared <audio> element into a Web Audio analyser the first time the
  // user presses play (an AudioContext can only start from a user gesture), then
  // resume it on every subsequent play. Routing audio through the graph keeps the
  // sound audible while exposing live frequency data for the visualiser.
  const ensureAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return null
    if (!audioCtxRef.current) {
      try {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!Ctx) return null
        const ctx = new Ctx()
        const source = ctx.createMediaElementSource(audio)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.82
        source.connect(analyser)
        analyser.connect(ctx.destination)
        audioCtxRef.current = ctx
        sourceRef.current = source
        analyserRef.current = analyser
      } catch {
        return null
      }
    }
    const ctx = audioCtxRef.current
    if (ctx && ctx.state === 'suspended') void ctx.resume()
    return ctx
  }, [])

  const getAnalyser = useCallback(() => analyserRef.current, [])

  // Toggle a root class so the layout can reserve space for the mini-player.
  useEffect(() => {
    document.documentElement.classList.toggle('has-track', current !== null)
  }, [current])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const close = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load() // fully unload the source so nothing keeps buffering
    }
    setCurrent(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const toggle = useCallback(
    (song: Song) => {
      const audio = audioRef.current
      if (!audio) return

      const sameTrack = current?.id === song.id
      if (sameTrack) {
        if (audio.paused) {
          ensureAudio()
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
      ensureAudio()
      audio.src = assetUrl(song.audio)
      audio.currentTime = 0
      setCurrent(song)
      setCurrentTime(0)
      setDuration(0)
      void audio.play().catch(() => setIsPlaying(false))
    },
    [current, ensureAudio],
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
    () => ({
      current, isPlaying, currentTime, duration,
      toggle, pause, close, seek, isCurrent, getAnalyser,
    }),
    [current, isPlaying, currentTime, duration, toggle, pause, close, seek, isCurrent, getAnalyser],
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
