import { STATUS_COLORS, STATUS_LABELS } from '../config'
import type { OrderStatus } from '../types'

export function StatusBadge({ status }: { status: OrderStatus }) {
  const colors = STATUS_COLORS[status]

  return (
    <span
      className="status-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-[var(--stroke)] px-2.5 py-0.5 text-xs font-extrabold"
      style={{ background: colors.background, color: colors.ink }}
    >
      <span
        className={status === 'in_progress' ? 'status-dot-pulse h-1.5 w-1.5 rounded-full' : 'h-1.5 w-1.5 rounded-full'}
        style={{ background: colors.ink }}
        aria-hidden
      />
      {STATUS_LABELS[status]}
    </span>
  )
}
