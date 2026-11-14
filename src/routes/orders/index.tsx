import { Button } from '@mantine/core'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback } from 'react'
import { DoodleMagnifier } from '../../components/Doodles'
import { ErrorState } from '../../components/ErrorState'
import { OrdersFilters } from '../../components/OrdersFilters'
import { OrdersTable } from '../../components/OrdersTable'
import { PageTitle } from '../../components/PageTitle'
import { PencilSpinner } from '../../components/PencilSpinner'
import { DEFAULT_SORT, ORDERS_SKELETON_ROWS, ROW_STAGGER_MS } from '../../config'
import { ordersQueryOptions } from '../../lib/queries'
import { isOrderStatus } from '../../lib/schemas'
import { isOrderSortField, sortOrders } from '../../lib/sort-orders'
import type { OrderFilters, OrderSort, OrderSortField, OrderStatus, SortDirection } from '../../types'

type OrdersSearch = {
  q?: string
  status?: OrderStatus
  sort?: OrderSortField
  dir?: SortDirection
}

function readSearchText(value: unknown) {
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value !== 'string' || value === '') return undefined
  return value
}

export const Route = createFileRoute('/orders/')({
  validateSearch: (search: Record<string, unknown>): OrdersSearch => ({
    q: readSearchText(search.q),
    status: isOrderStatus(search.status) ? search.status : undefined,
    sort: isOrderSortField(search.sort) && search.sort !== DEFAULT_SORT.field ? search.sort : undefined,
    dir: search.dir === 'desc' ? 'desc' : undefined,
  }),
  loaderDeps: ({ search }): OrderFilters => ({ q: search.q ?? '', status: search.status ?? '' }),
  loader: ({ context, deps }) => {
    const loading = context.queryClient.prefetchQuery(ordersQueryOptions(deps))
    if (typeof window === 'undefined') return loading
  },
  head: () => ({ meta: [{ title: 'Замовлення' }] }),
  component: OrdersPage,
})

function OrdersPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const filters: OrderFilters = { q: search.q ?? '', status: search.status ?? '' }
  const sort: OrderSort = {
    field: search.sort ?? DEFAULT_SORT.field,
    direction: search.dir ?? DEFAULT_SORT.direction,
  }

  const ordersQuery = useQuery({
    ...ordersQueryOptions(filters),
    placeholderData: keepPreviousData,
  })

  const changeFilters = useCallback(
    (nextFilters: OrderFilters) => {
      navigate({
        search: (previous) => ({
          ...previous,
          q: nextFilters.q || undefined,
          status: nextFilters.status || undefined,
        }),
        replace: true,
      })
    },
    [navigate],
  )


  function resetFilters() {
    navigate({ search: (previous) => ({ sort: previous.sort, dir: previous.dir }) })
  }

  function changeSort(field: OrderSortField) {
    const isSameField = field === sort.field
    const direction: SortDirection = isSameField && sort.direction === 'asc' ? 'desc' : 'asc'
    navigate({
      search: (previous) => ({
        ...previous,
        sort: field === DEFAULT_SORT.field ? undefined : field,
        dir: direction === 'desc' ? 'desc' : undefined,
      }),
      replace: true,
    })
  }

  function renderContent() {
    if (ordersQuery.isError) {
      return <ErrorState onRetry={() => ordersQuery.refetch()} />
    }

    if (!ordersQuery.data) {
      return <OrdersLoading />
    }

    if (ordersQuery.data.length === 0) {
      return (
        <div className="orders-empty sticker pop-in flex flex-col items-center gap-2 px-6 py-10 text-center">
          <DoodleMagnifier className="float-gently h-24 w-24" />
          <p className="hand text-4xl">Нічого не знайдено</p>
          <p className="font-semibold text-[var(--ink-soft)]">Спробуйте інший пошук або статус.</p>
          <Button mt="sm" onClick={resetFilters}>
            Скинути фільтри
          </Button>
        </div>
      )
    }

    return (
      <div
        className="orders-results transition-[opacity,filter] duration-300"
        style={{
          opacity: ordersQuery.isPlaceholderData ? 0.55 : 1,
          filter: ordersQuery.isPlaceholderData ? 'saturate(0.6)' : 'none',
        }}
      >
        <OrdersTable
          orders={sortOrders(ordersQuery.data, sort)}
          sort={sort}
          onSortChange={changeSort}
        />
      </div>
    )
  }

  return (
    <section className="orders-page">
      <PageTitle aside={ordersQuery.isFetching && <PencilSpinner />}>Замовлення</PageTitle>
      <OrdersFilters
        q={filters.q}
        status={filters.status}
        onChange={changeFilters}
      />
      <div className="orders-content mt-6" aria-busy={ordersQuery.isFetching}>
        {renderContent()}
      </div>
    </section>
  )
}

function OrdersLoading() {
  return (
    <div className="orders-loading flex flex-col gap-3" aria-label="Завантаження">
      {Array.from({ length: ORDERS_SKELETON_ROWS }, (_, index) => (
        <div
          key={index}
          className="skeleton-row h-14 rounded-[var(--wobbly-small)] border-2 border-dashed border-[var(--ink-soft)] opacity-60"
          style={{ animationDelay: `${index * ROW_STAGGER_MS}ms` }}
        />
      ))}
    </div>
  )
}
