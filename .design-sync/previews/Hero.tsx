import { Hero } from 'setivir'

// The full-viewport intro screen: wordmark, tagline, social row, ornament
// divider, intro paragraphs, and the "start listening" button. It renders
// in-flow as a `.section`, so it needs no wrapper — the single-card viewport
// (1000x860) gives it room to breathe. Content comes from the i18n context.

export function Default() {
  return <Hero />
}
