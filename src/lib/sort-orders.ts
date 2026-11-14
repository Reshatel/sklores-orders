import { ORDER_SORT_FIELDS, STATUS_SORT_ORDER } from '../config'
import type { Order, OrderSort, OrderSortField } from '../types'
import { getOrderTotal } from './pricing'

export function isOrderSortField(value: unknown): value is OrderSortField {
  return ORDER_SORT_FIELDS.some((field) => field === value)
}

function compareOrders(first: Order, second: Order, field: OrderSortField) {
  if (field === 'date') return Date.parse(first.createdAt) - Date.parse(second.createdAt)
  if (field === 'client') return first.client.name.localeCompare(second.client.name, 'uk')
  if (field === 'status') return STATUS_SORT_ORDER[first.status] - STATUS_SORT_ORDER[second.status]
  if (field === 'items') return first.items.length - second.items.length
  if (field === 'total') return getOrderTotal(first).costKopecks - getOrderTotal(second).costKopecks
  return first.id - second.id
}

export function sortOrders(orders: Order[], sort: OrderSort) {
  const directionSign = sort.direction === 'asc' ? 1 : -1
  return [...orders].sort((first, second) => {
    const result = compareOrders(first, second, sort.field) || first.id - second.id
    return result * directionSign
  })
}
