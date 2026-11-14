import { KOPECKS_IN_HRYVNIA, MIN_BILLABLE_AREA_MM2, MM2_IN_M2 } from '../config'
import type { Order } from '../types'

type SizedItem = {
  width: number
  height: number
  quantity: number
  pricePerM2: number
}

export type ItemPrice = {
  areaMm2: number
  billableAreaMm2: number
  costKopecks: number
}

const MM2_PER_KOPECK_UNIT = MM2_IN_M2 / KOPECKS_IN_HRYVNIA

export function roundDivide(value: number, divider: number) {
  return Math.floor((value + divider / 2) / divider)
}

export function getItemPrice(item: SizedItem): ItemPrice {
  const pieceArea = item.width * item.height
  const billablePieceArea = Math.max(pieceArea, MIN_BILLABLE_AREA_MM2)
  const billableAreaMm2 = billablePieceArea * item.quantity

  return {
    areaMm2: pieceArea * item.quantity,
    billableAreaMm2,
    costKopecks: roundDivide(billableAreaMm2 * item.pricePerM2, MM2_PER_KOPECK_UNIT),
  }
}

export function sumPrices(prices: ItemPrice[]): ItemPrice {
  return prices.reduce(
    (total, price) => ({
      areaMm2: total.areaMm2 + price.areaMm2,
      billableAreaMm2: total.billableAreaMm2 + price.billableAreaMm2,
      costKopecks: total.costKopecks + price.costKopecks,
    }),
    { areaMm2: 0, billableAreaMm2: 0, costKopecks: 0 },
  )
}

export function getOrderItemPrices(order: Order) {
  return order.items.map((item) =>
    getItemPrice({
      width: item.width,
      height: item.height,
      quantity: item.quantity,
      pricePerM2: item.glassType.pricePerM2,
    }),
  )
}

export function getOrderTotal(order: Order) {
  return sumPrices(getOrderItemPrices(order))
}
