import { API_DELAY_MAX_MS, API_DELAY_MIN_MS } from '../config'
import type { NewOrder } from '../lib/schemas'
import type { GlassType, Order, OrderFilters } from '../types'
import ordersFromFile from './data/orders.json'

const orders: Order[] = structuredClone(ordersFromFile as Order[])

const failureChance = Number(process.env.API_FAILURE_RATE ?? 0)

export function waitLikeRealServer() {
  const delay = API_DELAY_MIN_MS + Math.random() * (API_DELAY_MAX_MS - API_DELAY_MIN_MS)
  return new Promise((resolve) => setTimeout(resolve, delay))
}

async function prepareResponse() {
  await waitLikeRealServer()
  if (Math.random() < failureChance) {
    throw new Error('Сервер замовлень не відповів')
  }
}

function normalizeText(text: string) {
  return text
    .trim()
    .toLocaleLowerCase('uk-UA')
    .replace(/[’ʼ`]/g, "'")
    .replace(/^[#№]\s*/, '')
}

function matchesSearch(order: Order, search: string) {
  if (!search) return true
  if (String(order.id).includes(search)) return true
  return normalizeText(order.client.name).includes(search)
}

export async function findOrders(filters: OrderFilters) {
  await prepareResponse()
  const search = normalizeText(filters.q)
  return orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false
    return matchesSearch(order, search)
  })
}

export async function findOrderById(orderId: number) {
  await prepareResponse()
  return orders.find((order) => order.id === orderId) ?? null
}

function collectGlassTypes() {
  const glassTypes = new Map<number, GlassType>()
  for (const order of orders) {
    for (const item of order.items) {
      glassTypes.set(item.glassType.id, item.glassType)
    }
  }
  return [...glassTypes.values()].sort((a, b) => a.id - b.id)
}

export async function findGlassTypes() {
  await prepareResponse()
  return collectGlassTypes()
}

export async function addOrder(newOrder: NewOrder) {
  await prepareResponse()
  const glassTypes = collectGlassTypes()

  const items = newOrder.items.map((item, index) => {
    const glassType = glassTypes.find((type) => type.id === item.glassTypeId)
    if (!glassType) {
      throw new Error('Невідомий тип скла')
    }
    return {
      id: index + 1,
      glassType,
      width: item.width,
      height: item.height,
      quantity: item.quantity,
    }
  })

  const order: Order = {
    id: Math.max(0, ...orders.map((existing) => existing.id)) + 1,
    createdAt: new Date().toISOString(),
    status: 'new',
    client: { name: newOrder.clientName, phone: newOrder.phone },
    items,
  }

  orders.push(order)
  return order
}
