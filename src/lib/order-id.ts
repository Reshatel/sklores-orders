export function parseOrderId(rawId: string) {
  if (!/^\d{1,9}$/.test(rawId)) return null
  const orderId = Number(rawId)
  if (orderId <= 0) return null
  return orderId
}
