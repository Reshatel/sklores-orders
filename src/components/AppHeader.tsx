import { Button } from '@mantine/core'
import { Link, useRouterState } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'

function LogoDoodle() {
  return (
    <svg className="logo-doodle h-9 w-9" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M7 6.5 C15 5.5 25 5 33.5 6.2 C34.6 15 34.4 25 33.8 33.6 C25 34.6 15 34.8 6.4 33.7 C5.6 25 5.5 15 7 6.5 Z"
        fill="var(--mint)"
        stroke="var(--pencil)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M20 7 C20.4 16 20.2 25 19.8 33.4" stroke="var(--pencil)" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 12 L15 9.5" stroke="var(--pencil)" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
      <path d="M24.5 13 L29 10" stroke="var(--pencil)" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

export function AppHeader() {
  const isNavigating = useRouterState({ select: (state) => state.isLoading })

  return (
    <header className="app-header sticky top-0 z-20 border-b-2 border-[var(--stroke)] bg-[var(--paper)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/orders" className="app-logo group flex items-center gap-2">
          <span className="transition-transform duration-300 ease-[var(--spring)] group-hover:-rotate-6 group-hover:scale-110">
            <LogoDoodle />
          </span>
          <span className="hand text-3xl leading-none">Склопакети</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button component={Link} to="/orders/new" size="sm">
            <span className="sm:hidden">+ Нове</span>
            <span className="hidden sm:inline">+ Нове замовлення</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <div className="app-loading-line absolute inset-x-0 -bottom-[2px] h-[3px] overflow-hidden" aria-hidden>
        {isNavigating && <span className="app-loading-line-pencil block h-full w-1/3 rounded-full bg-[var(--pencil)]" />}
      </div>
    </header>
  )
}
