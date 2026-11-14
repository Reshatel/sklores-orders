import { Select, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { ORDER_STATUSES, SEARCH_DEBOUNCE_MS, STATUS_LABELS } from '../config'
import { isOrderStatus } from '../lib/schemas'
import type { OrderStatus } from '../types'

const ALL_STATUSES = 'all'

const statusOptions = [
  { value: ALL_STATUSES, label: 'Усі статуси' },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

type OrdersFiltersProps = {
  q: string
  status: OrderStatus | ''
  onChange: (filters: { q: string; status: OrderStatus | '' }) => void
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 transition-transform duration-300 ease-[var(--spring)] group-focus-within:-rotate-12 group-focus-within:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--pencil)"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="10.5" cy="10.5" r="6" fill="var(--lavender)" />
      <path d="M15 15 L20 20" />
    </svg>
  )
}

export function OrdersFilters({ q, status, onChange }: OrdersFiltersProps) {
  const [searchText, setSearchText] = useState(q)

  useEffect(() => {
    setSearchText(q)
  }, [q])

  useEffect(() => {
    if (searchText === q) return
    const timer = setTimeout(() => onChange({ q: searchText, status }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchText, q, status, onChange])

  function changeStatus(value: string | null) {
    onChange({ q: searchText, status: isOrderStatus(value) ? value : '' })
  }

  return (
    <div className="orders-filters flex flex-col gap-3 sm:flex-row">
      <TextInput
        className="orders-search group flex-1"
        label="Пошук"
        placeholder="Номер або ім'я клієнта"
        value={searchText}
        onChange={(event) => setSearchText(event.currentTarget.value)}
        leftSection={<SearchIcon />}
        rightSection={
          searchText ? (
            <button
              type="button"
              className="pop-in grid h-6 w-6 place-items-center rounded-full font-black text-[var(--ink-soft)] transition-transform hover:rotate-90 hover:text-[var(--ink)]"
              onClick={() => setSearchText('')}
              aria-label="Очистити пошук"
            >
              ×
            </button>
          ) : null
        }
      />
      <Select
        className="orders-status-filter sm:w-56"
        label="Статус"
        data={statusOptions}
        value={status || ALL_STATUSES}
        onChange={changeStatus}
        allowDeselect={false}
      />
    </div>
  )
}
