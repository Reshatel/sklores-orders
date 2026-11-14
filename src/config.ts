import type { OrderSort, OrderStatus } from './types'

export const API_DELAY_MIN_MS = 300
export const API_DELAY_MAX_MS = 800

export const MM2_IN_M2 = 1_000_000
export const MIN_BILLABLE_AREA_MM2 = 500_000

export const KOPECKS_IN_HRYVNIA = 100
export const CURRENCY_LABEL = 'грн'
export const AREA_LABEL = 'м²'

export const DATE_TIME_ZONE = 'Europe/Kyiv'

export const ORDER_STATUSES = ['new', 'in_progress', 'done'] as const satisfies readonly OrderStatus[]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Нове',
  in_progress: 'В роботі',
  done: 'Виконано',
}

export const STATUS_COLORS: Record<OrderStatus, { background: string; ink: string }> = {
  new: { background: 'var(--lavender)', ink: 'var(--lavender-ink)' },
  in_progress: { background: 'var(--butter)', ink: 'var(--butter-ink)' },
  done: { background: 'var(--mint)', ink: 'var(--mint-ink)' },
}

export const SEARCH_DEBOUNCE_MS = 300

export const QUERY_STALE_TIME_MS = 30_000
export const QUERY_RETRY_COUNT = 1

export const ROUTER_PENDING_MS = 150
export const ROUTER_PENDING_MIN_MS = 300

export const PHONE_PATTERN = /^\+380\d{9}$/
export const PHONE_ALLOWED_CHARS = /^\+?[\d\s().-]+$/
export const PHONE_EXAMPLE = '+380 67 123 45 67'
export const GLASS_SIZE_MIN_MM = 100
export const GLASS_SIZE_MAX_MM = 3000
export const QUANTITY_MIN = 1

export const ORDERS_TABLE_MIN_WIDTH = 640
export const ITEMS_TABLE_MIN_WIDTH = 820
export const ORDERS_SKELETON_ROWS = 6

export const ORDER_SORT_FIELDS = ['id', 'date', 'client', 'status', 'items', 'total'] as const
export const DEFAULT_SORT: OrderSort = { field: 'id', direction: 'asc' }

export const STATUS_SORT_ORDER: Record<OrderStatus, number> = {
  new: 0,
  in_progress: 1,
  done: 2,
}

export const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Nunito:wght@400;600;700;800;900&display=swap'

export const ROW_STAGGER_MS = 35
export const ROW_STAGGER_LIMIT = 12

export const SUMMARY_DELAY_MS = 90

export const FLIP_DURATION_MS = 450
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
