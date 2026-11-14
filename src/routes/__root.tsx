import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { AppHeader } from '../components/AppHeader'
import { NotFoundPage } from '../components/NotFoundPage'
import { RouteErrorState } from '../components/RouteErrorState'
import { FONTS_URL } from '../config'
import { theme } from '../theme'
import appCss from '../styles.css?url'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Замовлення склопакетів' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: FONTS_URL },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteErrorState,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <HeadContent />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <div className="app">
      <AppHeader />
      <main className="app-main mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
        <Outlet />
      </main>
    </div>
  )
}
