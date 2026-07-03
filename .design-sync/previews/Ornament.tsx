import { Ornament } from 'setivir'

// A tiny вышыванка divider — a row of red rhombi (172x14, currentColor). On
// its own it reads as blank, so present it the way it's actually used: a
// section divider with red colour context, sitting between text lines.

export function Default() {
  return (
    <div
      style={{
        padding: '56px 40px',
        textAlign: 'center',
        color: 'var(--red)',
      }}
    >
      <Ornament />
    </div>
  )
}

export function InContext() {
  return (
    <div
      style={{
        padding: '48px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-display, serif)',
          fontSize: 30,
          color: 'var(--ink)',
        }}
      >
        Дзякуй, што слухалі
      </h2>
      <span style={{ color: 'var(--red)', lineHeight: 0 }}>
        <Ornament />
      </span>
      <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-faint)' }}>
        падзяляе разьдзелы старонкі
      </p>
    </div>
  )
}
