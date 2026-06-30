import { useEffect } from 'react'
import { songs } from './data/songs'
import { I18nProvider, useI18n } from './i18n/I18nContext'
import { PlayerProvider } from './audio/PlayerContext'
import { useActiveSection } from './hooks/useActiveSection'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { TopBar } from './components/TopBar'
import { ProgressNav } from './components/ProgressNav'
import { Hero } from './components/Hero'
import { SongScreen } from './components/SongScreen'
import { Outro } from './components/Outro'
import { MiniPlayer } from './components/MiniPlayer'

// The data file stays in chronological order (id 1 = oldest); the page shows
// newest first, so render a recency-sorted copy.
const displaySongs = [...songs].sort((a, b) => b.id - a.id)

function Shell() {
  const { lang, t } = useI18n()
  useKeyboardNav()
  const activeIndex = useActiveSection()
  const total = songs.length

  // Songs occupy section indices 1..total (intro is 0, outro is last). The page
  // is newest-first, so map the active section back to its track number.
  const activeSong =
    activeIndex >= 1 && activeIndex <= total ? displaySongs[activeIndex - 1].id : null

  useEffect(() => {
    document.title =
      lang === 'be'
        ? 'Setivir — Музыка Тутэйшых'
        : 'Setivir — Songs of the Tuteyshya'
  }, [lang])

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('a11y.skip')}
      </a>
      <TopBar activeSong={activeSong} total={total} />
      <ProgressNav songs={displaySongs} activeIndex={activeIndex} />
      <main id="main-content">
        <Hero />
        {displaySongs.map((song) => (
          <SongScreen key={song.id} song={song} total={total} />
        ))}
        <Outro />
      </main>
      <MiniPlayer />
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <PlayerProvider>
        <Shell />
      </PlayerProvider>
    </I18nProvider>
  )
}
