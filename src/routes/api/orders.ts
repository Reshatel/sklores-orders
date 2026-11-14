import { createFileRoute } from '@tanstack/react-router'
import { isOrderStatus } from '../../lib/schemas'
import { findOrders, waitLikeRealServer } from '../../server/orders.server'

export const Route = createFileRoute('/api/orders')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams
        const q = params.get('q') ?? ''
        const rawStatus = params.get('status') ?? ''
        const status = isOrderStatus(rawStatus) ? rawStatus : ''

        if (rawStatus && !status) {
          await waitLikeRealServer()
          return Response.json(
            { error: 'Невідомий статус. Можливі значення: new, in_progress, done' },
            { status: 400 },
          )
        }

        const orders = await findOrders({ q, status })
        return Response.json(orders)
      },
    },
  },
})
