import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { NewOrderForm } from '../../components/NewOrderForm'
import { PageTitle } from '../../components/PageTitle'
import { RouteErrorState } from '../../components/RouteErrorState'
import { glassTypesQueryOptions } from '../../lib/queries'

export const Route = createFileRoute('/orders/new')({
  loader: ({ context }) => context.queryClient.ensureQueryData(glassTypesQueryOptions()),
  head: () => ({ meta: [{ title: 'Нове замовлення' }] }),
  component: NewOrderPage,
  pendingComponent: NewOrderLoading,
  errorComponent: RouteErrorState,
})

function NewOrderPage() {
  const { data: glassTypes } = useSuspenseQuery(glassTypesQueryOptions())

  return (
    <section className="new-order-page">
      <PageTitle>Нове замовлення</PageTitle>
      {glassTypes.length === 0 ? (
        <p className="sticker p-5 font-bold">Немає доступних типів скла.</p>
      ) : (
        <NewOrderForm glassTypes={glassTypes} />
      )}
    </section>
  )
}

function NewOrderLoading() {
  return (
    <div className="new-order-loading flex flex-col gap-5" aria-label="Завантаження">
      <div className="skeleton-row h-14 w-72 rounded-[var(--wobbly-small)] bg-[var(--paper-sunken)]" />
      <div className="skeleton-row h-28 rounded-[var(--wobbly)] border-2 border-dashed border-[var(--ink-soft)]" />
      <div className="skeleton-row h-44 rounded-[var(--wobbly)] border-2 border-dashed border-[var(--ink-soft)]" />
    </div>
  )
}
