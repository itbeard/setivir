import { useEffect, useRef } from 'react'
import { PromptDisclosure } from 'setivir'
import { RODNY } from './_fixtures'

// A native <details> disclosure used for lyrics / prompt text. Collapsed it is
// just a summary row; expanded it reveals the content in a <pre> block.

// Forced open via a ref so the rich monospace lyrics body shows in the card
// (the component has no `open` prop).
export function Expanded() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    ref.current?.querySelectorAll('details').forEach((d) => (d.open = true))
  }, [])
  return (
    <div ref={ref} style={{ padding: 24, maxWidth: 560 }}>
      <PromptDisclosure label="Lyrics" content={RODNY.lyrics.be} note="Original — тарашкевіца" />
    </div>
  )
}

// Default closed state — shows just the summary label row.
export function Collapsed() {
  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <PromptDisclosure label="Style prompt" content={RODNY.stylePrompt} />
    </div>
  )
}
