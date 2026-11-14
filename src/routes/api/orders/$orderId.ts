import { createFileRoute } from '@tanstack/react-router'
import { parseOrderId } from '../../../lib/order-id'
import { findOrderById, waitLikeRealServer } from '../../../server/orders.server'

export const Route = createFileRoute('/api/orders/$orderId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const orderId = parseOrderId(params.orderId)
        if (orderId === null) {
          await waitLikeRealServer()
          return Response.json({ error: 'Замовлення не знайдено' }, { status: 404 })
        }

        const order = await findOrderById(orderId)

        if (!order) {
          return Response.json({ error: 'Замовлення не знайдено' }, { status: 404 })
        }

        return Response.json(order)
      },
    },
  },
})
