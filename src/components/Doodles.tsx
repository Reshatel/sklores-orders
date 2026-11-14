type DoodleProps = {
  className?: string
}

const strokeProps = {
  stroke: 'var(--pencil)',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
  pathLength: 1,
}

export function DoodleUnderline({ className }: DoodleProps) {
  return (
    <svg className={`doodle-draw ${className ?? ''}`} viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
      <path d="M3 9 C40 3 80 12 120 6 C150 2 175 9 197 5" {...strokeProps} stroke="var(--peach-ink)" strokeWidth={3} />
    </svg>
  )
}

export function DoodleMagnifier({ className }: DoodleProps) {
  return (
    <svg className={`doodle-draw ${className ?? ''}`} viewBox="0 0 120 120" aria-hidden>
      <circle cx="52" cy="50" r="30" {...strokeProps} fill="var(--lavender)" />
      <path d="M74 73 C82 81 90 89 101 100" {...strokeProps} strokeWidth={6} />
      <path d="M38 40 C42 34 49 31 56 31" {...strokeProps} />
      <path d="M44 56 C48 60 56 60 60 56" {...strokeProps} />
    </svg>
  )
}

export function DoodleCrackedPane({ className }: DoodleProps) {
  return (
    <svg className={`doodle-draw ${className ?? ''}`} viewBox="0 0 140 120" aria-hidden>
      <path d="M22 14 C55 11 88 12 118 15 C120 45 119 78 117 106 C85 108 52 108 21 105 C19 75 19 45 22 14 Z" {...strokeProps} fill="var(--mint)" />
      <path d="M58 13 L66 40 L52 55 L70 72 L62 106" {...strokeProps} />
      <path d="M66 40 L92 34" {...strokeProps} />
      <path d="M70 72 L98 80" {...strokeProps} />
      <path d="M52 55 L28 62" {...strokeProps} />
    </svg>
  )
}

export function DoodleCloud({ className }: DoodleProps) {
  return (
    <svg className={`doodle-draw ${className ?? ''}`} viewBox="0 0 140 110" aria-hidden>
      <path d="M34 70 C18 70 14 50 28 45 C26 28 48 20 58 32 C64 16 92 16 96 36 C112 32 124 46 116 60 C126 70 116 82 104 78 C90 82 50 82 34 70 Z" {...strokeProps} fill="var(--rose)" />
      <path d="M50 90 L44 102" {...strokeProps} />
      <path d="M72 90 L66 104" {...strokeProps} />
      <path d="M94 90 L88 102" {...strokeProps} />
    </svg>
  )
}

export function DoodleEmptyBox({ className }: DoodleProps) {
  return (
    <svg className={`doodle-draw ${className ?? ''}`} viewBox="0 0 140 110" aria-hidden>
      <path d="M24 46 L70 30 L116 46 L116 92 L70 104 L24 92 Z" {...strokeProps} fill="var(--butter)" />
      <path d="M24 46 L70 60 L116 46" {...strokeProps} />
      <path d="M70 60 L70 104" {...strokeProps} />
      <path d="M24 46 L12 30 L58 16 L70 30" {...strokeProps} />
      <path d="M116 46 L128 30 L82 16 L70 30" {...strokeProps} />
    </svg>
  )
}
