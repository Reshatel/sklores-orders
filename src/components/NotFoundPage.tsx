import { Button } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { DoodleCrackedPane } from './Doodles'

export function NotFoundPage() {
  return (
    <section className="not-found-page flex flex-col items-center gap-2 py-10 text-center">
      <DoodleCrackedPane className="float-gently h-32 w-36" />
      <h1 className="hand text-6xl leading-none">404</h1>
      <p className="text-xl font-extrabold">Не знайдено</p>
      <p className="font-semibold text-[var(--ink-soft)]">Такої сторінки або замовлення не існує.</p>
      <Button mt="md" component={Link} to="/orders">
        ← До списку
      </Button>
    </section>
  )
}
