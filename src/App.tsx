import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { Song } from './types'
import { songs } from './data/songs'
import { I18nProvider, useI18n } from './i18n/I18nContext'
import { PlayerProvider, usePlayer } from './audio/PlayerContext'
import { useActiveSection } from './hooks/useActiveSection'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useRevealSections } from './hooks/useRevealSections'
import { useTrackOrder, type TrackOrder } from './hooks/useTrackOrder'
import { getSections, scrollToId } from './lib/nav'
import { settings } from './settings'
import { TopBar } from './components/TopBar'
import { ProgressNav } from './components/ProgressNav'
import { ScrollProgress } from './components/ScrollProgress'
import { PaperGrain } from './components/PaperGrain'
import { OrnamentDivider } from './components/OrnamentDivider'
import { Hero } from './components/Hero'
import { SongScreen } from './components/SongScreen'
import { Outro } from './components/Outro'
import { MiniPlayer } from './components/MiniPlayer'

function Shell({
  displaySongs,
  order,
  onToggleOrder,
}: {
  displaySongs: Song[]
  order: TrackOrder
  onToggleOrder: () => void
}) {
  const { lang, t, loc } = useI18n()
  const { current, isPlaying } = usePlayer()
  useKeyboardNav()
  const activeIndex = useActiveSection()
  const animOn = useRevealSections(settings.entranceAnim)
  const total = songs.length

  // Songs occupy section indices 1..total (intro is 0, outro is last); map the
  // active section back to its track number via the current page order.
  const activeSong =
    activeIndex >= 1 && activeIndex <= total ? displaySongs[activeIndex - 1].id : null

  // Flipping the sort order reshuffles the sections under the visitor's feet;
  // remember the song they were on and snap back to it after the reorder.
  const keepSlugRef = useRef<string | null>(null)
  const revealedRef = useRef<Element[]>([])
  const toggleOrder = () => {
    keepSlugRef.current =
      activeIndex >= 1 && activeIndex <= total
        ? displaySongs[activeIndex - 1].slug
        : null
    revealedRef.current = Array.from(
      document.querySelectorAll('[data-section].is-in'),
    )
    onToggleOrder()
  }
  useLayoutEffect(() => {
    // Reordering flips the alt striping, so React rewrites className and wipes
    // the observer-added .is-in — and the observer won't re-fire for a section
    // that never left the viewport. Restore what was already revealed.
    revealedRef.current.forEach((el) => el.classList.add('is-in'))
    revealedRef.current = []

    const slug = keepSlugRef.current
    if (!slug) return
    keepSlugRef.current = null
    // 'instant', not 'auto': html has scroll-behavior:smooth, which 'auto'
    // would inherit — animating through the whole reshuffled page.
    document
      .getElementById(`song-${slug}`)
      ?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [displaySongs])

  // Tab title: base site title, or "▶ {track} — Setivir" while playing.
  useEffect(() => {
    const base =
      lang === 'be'
        ? 'Setivir — Музыка Тутэйшых'
        : 'Setivir — Songs of the Tuteyshya'
    document.title =
      isPlaying && current ? `▶ ${loc(current.title)} — Setivir` : base
  }, [lang, isPlaying, current, loc])

  // When playback moves from one track to another (auto-advance after a song
  // ends, mini-player prev/next, lock-screen controls), bring the new song's
  // screen into view. Starting playback from silence doesn't scroll — the
  // listener pressed play on the screen they're already looking at.
  const prevTrackIdRef = useRef<number | null>(null)
  useEffect(() => {
    const prevId = prevTrackIdRef.current
    prevTrackIdRef.current = current?.id ?? null
    if (!current || prevId === null || prevId === current.id) return
    scrollToId(`song-${current.slug}`)
  }, [current])

  // Honor an incoming #hash deep link once the sections exist.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    const raf = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  // Keep location.hash in sync with the active section (deep links). Skip the
  // initial render so an incoming hash isn't clobbered before the jump above.
  const hashSyncedRef = useRef(false)
  useEffect(() => {
    if (!hashSyncedRef.current) {
      hashSyncedRef.current = true
      return
    }
    const id = getSections()[activeIndex]?.id
    if (!id) return
    try {
      window.history.replaceState(null, '', `#${id}`)
    } catch {
      /* sandboxed iframe etc. */
    }
  }, [activeIndex])

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('a11y.skip')}
      </a>
      <ScrollProgress />
      {settings.paperGrain && <PaperGrain />}
      <TopBar
        activeSong={activeSong}
        total={total}
        songs={displaySongs}
        edge={activeIndex === 0 ? 'intro' : activeIndex === total + 1 ? 'outro' : null}
      />
      <ProgressNav songs={displaySongs} activeIndex={activeIndex} />
      <main id="main-content" data-anim={animOn ? 'on' : undefined}>
        <Hero />
        {displaySongs.map((song, i) => (
          <Fragment key={song.id}>
            {settings.ornamentDividers && <OrnamentDivider />}
            <SongScreen
              song={song}
              total={total}
              alt={settings.altSongBg && i % 2 === 1}
            />
          </Fragment>
        ))}
        {settings.ornamentDividers && <OrnamentDivider />}
        <Outro total={total} order={order} onToggleOrder={toggleOrder} />
      </main>
      <MiniPlayer />
    </>
  )
}

export default function App() {
  // The data file stays in chronological order (id 1 = oldest). By default the
  // page follows it (01 → NN); the Outro toggle flips to newest-first, and the
  // choice persists in localStorage.
  const [order, toggleOrder] = useTrackOrder()
  const displaySongs = useMemo(
    () => (order === 'newest' ? [...songs].reverse() : songs),
    [order],
  )

  return (
    <I18nProvider>
      <PlayerProvider playlist={displaySongs}>
        <Shell displaySongs={displaySongs} order={order} onToggleOrder={toggleOrder} />
      </PlayerProvider>
    </I18nProvider>
  )
}
