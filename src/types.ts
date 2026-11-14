import type { ORDER_SORT_FIELDS } from './config'

export type OrderStatus = 'new' | 'in_progress' | 'done'

export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number]

export type SortDirection = 'asc' | 'desc'

export type OrderSort = {
  field: OrderSortField
  direction: SortDirection
}

export type GlassType = {
  id: number
  name: string
  pricePerM2: number
}

export type OrderItem = {
  id: number
  glassType: GlassType
  width: number
  height: number
  quantity: number
}

export type Client = {
  name: string
  phone: string
}

export type Order = {
  id: number
  createdAt: string
  status: OrderStatus
  client: Client
  items: OrderItem[]
}

export type OrderFilters = {
  q: string
  status: OrderStatus | ''
}
