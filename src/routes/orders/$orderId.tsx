import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { DoodleEmptyBox } from '../../components/Doodles'
import { NotFoundPage } from '../../components/NotFoundPage'
import { OrderItemsTable } from '../../components/OrderItemsTable'
import { RouteErrorState } from '../../components/RouteErrorState'
import { StatusBadge } from '../../components/StatusBadge'
import { SUMMARY_DELAY_MS } from '../../config'
import { formatArea, formatDate, formatMoney } from '../../lib/format'
import { parseOrderId } from '../../lib/order-id'
import { formatPhone } from '../../lib/phone'
import { getOrderTotal } from '../../lib/pricing'
import { orderQueryOptions } from '../../lib/queries'

export const Route = createFileRoute('/orders/$orderId')({
  loader: async ({ context, params }) => {
    const orderId = parseOrderId(params.orderId)
    if (orderId === null) throw notFound()

    const order = await context.queryClient.ensureQueryData(orderQueryOptions(orderId))
    if (!order) throw notFound()

    return { orderId }
  },
  head: ({ match, params }) => ({
    meta: [{ title: match.status === 'notFound' ? 'Не знайдено' : `Замовлення №${params.orderId}` }],
  }),
  component: OrderPage,
  pendingComponent: OrderLoading,
  errorComponent: RouteErrorState,
  notFoundComponent: NotFoundPage,
})

function OrderPage() {
  const { orderId } = Route.useLoaderData()
  const { data: order } = useSuspenseQuery(orderQueryOptions(orderId))

  if (!order) return <NotFoundPage />

  const total = getOrderTotal(order)

  return (
    <section className="order-page flex flex-col gap-6">
      <Link
        to="/orders"
        className="order-back-link group inline-flex items-center gap-1 self-start font-extrabold text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
      >
        <span className="inline-block transition-transform duration-300 ease-[var(--spring)] group-hover:-translate-x-1">←</span>
        До списку
      </Link>

      <header className="order-hero flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hand text-3xl leading-none text-[var(--ink-soft)]">Замовлення</p>
          <h1 className="text-5xl font-black leading-tight sm:text-6xl">
            №{order.id}
          </h1>
        </div>
        <div className="pop-in">
          <StatusBadge status={order.status} />
        </div>
      </header>

      <dl className="order-info sticker rise-in grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
        <InfoField label="Клієнт">{order.client.name}</InfoField>
        <InfoField label="Телефон">
          <a className="order-phone underline decoration-[var(--marker)] decoration-wavy decoration-2 underline-offset-4" href={`tel:${order.client.phone}`}>
            {formatPhone(order.client.phone)}
          </a>
        </InfoField>
        <InfoField label="Дата">{formatDate(order.createdAt)}</InfoField>
      </dl>

      {order.items.length === 0 ? (
        <div className="order-no-items sticker pop-in flex flex-col items-center gap-2 px-6 py-10 text-center">
          <DoodleEmptyBox className="float-gently h-24 w-28" />
          <p className="hand text-4xl">Тут поки порожньо</p>
          <p className="font-semibold text-[var(--ink-soft)]">
            У цьому замовленні ще немає позицій, тому вартість не розрахована.
          </p>
        </div>
      ) : (
        <>
          <section className="order-items rise-in [animation-delay:80ms]">
            <h2 className="hand mb-2 text-4xl">Позиції</h2>
            <div className="sticker overflow-hidden">
              <OrderItemsTable items={order.items} />
            </div>
          </section>

          <section className="order-summary grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryCard label="Площа" value={formatArea(total.areaMm2)} delay={0} />
            <SummaryCard label="До оплати" value={formatArea(total.billableAreaMm2)} delay={1} />
            <SummaryCard label="Вартість" value={formatMoney(total.costKopecks)} delay={2} highlighted />
          </section>
        </>
      )}
    </section>
  )
}

function InfoField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-extrabold text-[var(--ink-soft)]">{label}</dt>
      <dd className="mt-0.5 text-lg font-bold">{children}</dd>
    </div>
  )
}

type SummaryCardProps = {
  label: string
  value: string
  delay: number
  highlighted?: boolean
}

function SummaryCard({ label, value, delay, highlighted = false }: SummaryCardProps) {
  return (
    <div
      className={highlighted ? 'summary-card sticker pop-in col-span-2 bg-[var(--peach)]! px-5 py-4 sm:col-span-1' : 'summary-card sticker pop-in px-5 py-4'}
      style={{ animationDelay: `${SUMMARY_DELAY_MS * (delay + 1)}ms` }}
    >
      <p className="text-sm font-extrabold text-[var(--ink-soft)]">{label}</p>
      <p className={highlighted ? 'mt-1 text-2xl font-black text-[var(--peach-ink)]' : 'mt-1 text-2xl font-black'}>{value}</p>
    </div>
  )
}

function OrderLoading() {
  return (
    <div className="order-loading flex flex-col gap-5" aria-label="Завантаження">
      <div className="skeleton-row h-5 w-28 rounded-full bg-[var(--paper-sunken)]" />
      <div className="skeleton-row h-14 w-56 rounded-[var(--wobbly-small)] bg-[var(--paper-sunken)]" />
      <div className="skeleton-row h-24 rounded-[var(--wobbly)] border-2 border-dashed border-[var(--ink-soft)]" />
      <div className="skeleton-row h-48 rounded-[var(--wobbly)] border-2 border-dashed border-[var(--ink-soft)]" />
    </div>
  )
}
