import { queryOptions } from '@tanstack/react-query'
import { fetchGlassTypes, fetchOrder, fetchOrders } from '../server/orders.functions'
import type { OrderFilters } from '../types'

export function ordersQueryOptions(filters: OrderFilters) {
  return queryOptions({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders({ data: filters }),
  })
}

export function orderQueryOptions(orderId: number) {
  return queryOptions({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder({ data: orderId }),
  })
}

export function glassTypesQueryOptions() {
  return queryOptions({
    queryKey: ['glass-types'],
    queryFn: () => fetchGlassTypes(),
  })
}
