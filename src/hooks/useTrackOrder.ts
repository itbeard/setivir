import { useCallback, useEffect, useState } from 'react'

/** Page order of the track list: chronological (01 → NN) or newest-first. */
export type TrackOrder = 'chrono' | 'newest'

const STORAGE_KEY = 'setivir:track-order'

function loadOrder(): TrackOrder {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'newest' ? 'newest' : 'chrono'
  } catch {
    return 'chrono'
  }
}

/**
 * Visitor-chosen track order, persisted in localStorage so returning
 * listeners keep their preference. Defaults to chronological (first → last).
 */
export function useTrackOrder(): [TrackOrder, () => void] {
  const [order, setOrder] = useState<TrackOrder>(loadOrder)

  const toggleOrder = useCallback(() => {
    setOrder((o) => (o === 'chrono' ? 'newest' : 'chrono'))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, order)
    } catch {
      /* private mode / storage denied — preference just won't persist */
    }
  }, [order])

  return [order, toggleOrder]
}
