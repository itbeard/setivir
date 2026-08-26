import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Song } from '../types'

const STORAGE_KEY = 'setivir:seen-songs'

/**
 * Keys the site has always written on every visit (language, track order).
 * A visitor who has any of them but no seen-songs record was here before this
 * feature shipped — they've seen everything up to LEGACY_SEEN_MAX_ID.
 */
const LEGACY_KEYS = ['setivir-lang', 'setivir:track-order']
const LEGACY_SEEN_MAX_ID = 20

function isLegacyVisitor(): boolean {
  try {
    return LEGACY_KEYS.some((k) => localStorage.getItem(k) !== null)
  } catch {
    return false
  }
}

function loadSeen(): number[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : null
  } catch {
    return null
  }
}

function saveSeen(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* private mode / storage denied — the hint just won't persist */
  }
}

/**
 * Tracks which songs a returning visitor hasn't seen yet.
 *
 * On the very first visit every song is silently recorded as seen — a
 * newcomer gets no "new songs" hint. Visitors from before this feature
 * existed (no record, but other site keys present) are treated as having
 * seen songs 1..LEGACY_SEEN_MAX_ID. On later visits any song whose id isn't
 * in storage counts as new until its screen has been scrolled into view, at
 * which point it's marked seen (via `markSeen`). Returns the set of unseen
 * ids in the order the songs are listed.
 */
export function useNewSongs(songs: Song[]): {
  newIds: Set<number>
  markSeen: (id: number) => void
} {
  const [unseen, setUnseen] = useState<number[]>(() => {
    const seen = loadSeen()
    const all = songs.map((s) => s.id)
    if (seen === null) {
      if (!isLegacyVisitor()) {
        saveSeen(all)
        return []
      }
      return all.filter((id) => id > LEGACY_SEEN_MAX_ID)
    }
    const seenSet = new Set(seen)
    return all.filter((id) => !seenSet.has(id))
  })

  // Keep storage current: everything except what's still unseen is seen.
  useEffect(() => {
    const unseenSet = new Set(unseen)
    saveSeen(songs.filter((s) => !unseenSet.has(s.id)).map((s) => s.id))
  }, [songs, unseen])

  const markSeen = useCallback((id: number) => {
    setUnseen((u) => (u.includes(id) ? u.filter((x) => x !== id) : u))
  }, [])

  const newIds = useMemo(() => new Set(unseen), [unseen])
  return { newIds, markSeen }
}
