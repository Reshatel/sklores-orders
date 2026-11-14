import { createServerFn } from '@tanstack/react-start'
import { newOrderSchema, orderIdSchema, ordersFiltersSchema } from '../lib/schemas'
import { addOrder, findGlassTypes, findOrderById, findOrders } from './orders.server'

export const fetchOrders = createServerFn({ method: 'GET' })
  .validator(ordersFiltersSchema)
  .handler(({ data }) => findOrders(data))

export const fetchOrder = createServerFn({ method: 'GET' })
  .validator(orderIdSchema)
  .handler(({ data }) => findOrderById(data))

export const fetchGlassTypes = createServerFn({ method: 'GET' }).handler(() => findGlassTypes())

export const createOrder = createServerFn({ method: 'POST' })
  .validator(newOrderSchema)
  .handler(({ data }) => addOrder(data))
