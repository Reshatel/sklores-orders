import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { ROW_STAGGER_LIMIT, ROW_STAGGER_MS, STATUS_COLORS } from '../config'
import { formatDate, formatMoney } from '../lib/format'
import { getOrderTotal } from '../lib/pricing'
import { useFlipAnimation } from '../lib/use-flip-animation'
import type { Order, OrderSort, OrderSortField } from '../types'
import { StatusBadge } from './StatusBadge'

const columns: { field: OrderSortField; label: string; alignRight?: boolean }[] = [
  { field: 'id', label: '№' },
  { field: 'date', label: 'Дата' },
  { field: 'client', label: 'Клієнт' },
  { field: 'status', label: 'Статус' },
  { field: 'items', label: 'Позицій', alignRight: true },
  { field: 'total', label: 'Вартість', alignRight: true },
]

type OrdersTableProps = {
  orders: Order[]
  sort: OrderSort
  onSortChange: (field: OrderSortField) => void
}

function getAriaSort(field: OrderSortField, sort: OrderSort) {
  if (field !== sort.field) return 'none'
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

function getArrowClassName(field: OrderSortField, sort: OrderSort) {
  if (field !== sort.field) return 'sort-arrow opacity-0 group-hover/sort:opacity-40'
  return sort.direction === 'asc' ? 'sort-arrow opacity-100' : 'sort-arrow opacity-100 rotate-180'
}

export function OrdersTable({ orders, sort, onSortChange }: OrdersTableProps) {
  const listRef = useRef<HTMLUListElement>(null)
  useFlipAnimation(listRef, orders.map((order) => order.id).join(','))

  return (
    <div className="orders-table" role="table" aria-label="Замовлення">
      <div className="orders-head orders-grid hidden px-4 pb-2 sm:grid" role="row">
        {columns.map((column) => (
          <span
            key={column.field}
            role="columnheader"
            aria-sort={getAriaSort(column.field, sort)}
            className={column.alignRight ? 'text-right' : undefined}
          >
            <button
              type="button"
              className="group/sort inline-flex items-center gap-1 text-sm font-extrabold text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
              onClick={() => onSortChange(column.field)}
            >
              {column.label}
              <span className={getArrowClassName(column.field, sort)} aria-hidden>
                ↑
              </span>
            </button>
          </span>
        ))}
      </div>

      <div className="orders-sort-mobile mb-3 flex flex-wrap gap-2 sm:hidden" aria-label="Сортування">
        {columns.map((column) => (
          <button
            key={column.field}
            type="button"
            className={
              column.field === sort.field
                ? 'sticker-button bg-[var(--butter)]! px-2.5 py-1 text-xs font-extrabold text-[var(--butter-ink)]!'
                : 'sticker-button px-2.5 py-1 text-xs font-bold'
            }
            onClick={() => onSortChange(column.field)}
          >
            {column.label}
            {column.field === sort.field && (sort.direction === 'asc' ? ' ↑' : ' ↓')}
          </button>
        ))}
      </div>

      <ul ref={listRef} className="orders-rows flex flex-col gap-3" role="rowgroup">
        {orders.map((order, index) => (
          <li
            key={order.id}
            role="row"
            className="order-row rise-in group relative"
            data-flip-key={order.id}
            style={{ animationDelay: `${Math.min(index, ROW_STAGGER_LIMIT) * ROW_STAGGER_MS}ms` }}
          >
            <div
              className="order-row-body orders-grid relative isolate overflow-hidden rounded-[var(--wobbly-small)] border-2 border-[var(--stroke)] bg-[var(--paper-raised)] px-4 py-3"
              style={{ ['--row-fill' as string]: STATUS_COLORS[order.status].background }}
            >
              <span role="cell" className="order-cell-id">
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: String(order.id) }}
                  className="order-row-link text-lg font-black after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                >
                  №{order.id}
                </Link>
              </span>
              <span role="cell" className="order-cell-date text-sm font-semibold text-[var(--ink-soft)]">
                {formatDate(order.createdAt)}
              </span>
              <span role="cell" className="order-cell-client truncate font-bold">
                {order.client.name}
              </span>
              <span role="cell" className="order-cell-status">
                <StatusBadge status={order.status} />
              </span>
              <span role="cell" className="order-cell-items text-sm font-semibold text-[var(--ink-soft)] sm:text-right">
                <span className="sm:hidden">Позицій: </span>
                {order.items.length}
              </span>
              <span role="cell" className="order-cell-total whitespace-nowrap text-right font-extrabold">
                {formatMoney(getOrderTotal(order).costKopecks)}
                <span
                  className="order-row-arrow ml-1 inline-block opacity-0 transition-all duration-300 ease-[var(--spring)] group-hover:translate-x-1 group-hover:opacity-100"
                  aria-hidden
                >
                  →
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
