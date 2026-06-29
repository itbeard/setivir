/**
 * A small Belarusian-ornament (вышыванка) divider: a row of red rhombi.
 * Colour comes from `currentColor`, so style it via the parent's `color`.
 */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="172"
      height="14"
      viewBox="0 0 172 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1="7" x2="50" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* outline rhombus */}
      <path d="M62 3 L66 7 L62 11 L58 7 Z" stroke="currentColor" strokeWidth="1" />
      {/* filled centre rhombus */}
      <path d="M86 1 L91 7 L86 13 L81 7 Z" fill="currentColor" />
      {/* outline rhombus */}
      <path d="M110 3 L114 7 L110 11 L106 7 Z" stroke="currentColor" strokeWidth="1" />
      <line x1="122" y1="7" x2="172" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}
