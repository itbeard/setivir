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
import { useI18n } from '../i18n/I18nContext'

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
  /** Play the neighbouring track in playlist order (page order). */
  playNext: () => void
  playPrev: () => void
  /** The live frequency analyser, for beat-reactive visuals. Null until first play. */
  getAnalyser: () => AnalyserNode | null
}

const PlayerContext = createContext<PlayerValue | null>(null)

/** A play() promise rejected by a quick src switch — not a genuine error. */
function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

export function PlayerProvider({
  playlist,
  children,
}: {
  /** Ordered playlist (page order) used for auto-advance and prev/next. */
  playlist?: Song[]
  children: ReactNode
}) {
  const { t, loc } = useI18n()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Web Audio graph for the beat-reactive cover visual, built lazily on first play.
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const [current, setCurrent] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  // Screen-reader announcement for track changes (aria-live region below).
  const [announce, setAnnounce] = useState('')
  // The mount-once <audio> effect reaches the latest advance logic through
  // this ref, so `ended` can move down the playlist without re-binding.
  const advanceRef = useRef<() => boolean>(() => false)

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
      // Auto-advance through the playlist; stop only after the last track.
      if (advanceRef.current()) return
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

  const neighbor = useCallback(
    (dir: 1 | -1): Song | null => {
      if (!current || !playlist?.length) return null
      const idx = playlist.findIndex((s) => s.id === current.id)
      if (idx < 0) return null
      return playlist[idx + dir] ?? null
    },
    [current, playlist],
  )

  const playNext = useCallback(() => {
    const next = neighbor(1)
    if (next) toggle(next)
  }, [neighbor, toggle])

  const playPrev = useCallback(() => {
    const prev = neighbor(-1)
    if (prev) toggle(prev)
  }, [neighbor, toggle])

  useEffect(() => {
    advanceRef.current = () => {
      const next = neighbor(1)
      if (!next) return false
      toggle(next)
      return true
    }
  }, [neighbor, toggle])

  // ── Media Session: lock-screen / hardware controls ──
  // Safari implements the API only partially, so every call is guarded.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    if (!current) {
      try {
        ms.metadata = null
        ms.playbackState = 'none'
      } catch {
        /* unsupported */
      }
      return
    }
    try {
      const cover = new URL(assetUrl(current.cover), window.location.href).href
      const type = current.cover.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
      ms.metadata = new MediaMetadata({
        title: loc(current.title),
        artist: 'Setivir',
        album: 'Setivir',
        artwork: [{ src: cover, sizes: '512x512', type }],
      })
    } catch {
      /* unsupported */
    }
    const set = (action: MediaSessionAction, handler: MediaSessionActionHandler) => {
      try {
        ms.setActionHandler(action, handler)
      } catch {
        /* unsupported action */
      }
    }
    set('play', () => toggle(current))
    set('pause', () => pause())
    set('nexttrack', () => playNext())
    set('previoustrack', () => playPrev())
    set('seekto', (d) => {
      if (d.seekTime != null) seek(d.seekTime)
    })
  }, [current, loc, toggle, pause, playNext, playPrev, seek])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.playbackState = current
        ? isPlaying
          ? 'playing'
          : 'paused'
        : 'none'
    } catch {
      /* unsupported */
    }
  }, [current, isPlaying])

  // Announce track changes to screen readers ("Цяпер грае: …").
  const announcedIdRef = useRef<number | null>(null)
  useEffect(() => {
    if (!current) {
      announcedIdRef.current = null
      setAnnounce('')
      return
    }
    if (isPlaying && announcedIdRef.current !== current.id) {
      announcedIdRef.current = current.id
      setAnnounce(`${t('player.nowPlaying')}: ${loc(current.title)}`)
    }
  }, [current, isPlaying, t, loc])

  const value = useMemo<PlayerValue>(
    () => ({
      current, isPlaying, currentTime, duration,
      toggle, pause, close, seek, isCurrent, playNext, playPrev, getAnalyser,
    }),
    [current, isPlaying, currentTime, duration, toggle, pause, close, seek, isCurrent, playNext, playPrev, getAnalyser],
  )

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div className="visually-hidden" aria-live="polite">
        {announce}
      </div>
    </PlayerContext.Provider>
  )
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
