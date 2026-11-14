import { QueryClient } from '@tanstack/react-query'
import {
  createRouter,
  parseSearchWith,
  stringifySearchWith,
} from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import {
  QUERY_RETRY_COUNT,
  QUERY_STALE_TIME_MS,
  ROUTER_PENDING_MIN_MS,
  ROUTER_PENDING_MS,
} from './config'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: QUERY_RETRY_COUNT,
        refetchOnWindowFocus: false,
      },
    },
  })

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultPendingMs: ROUTER_PENDING_MS,
    defaultPendingMinMs: ROUTER_PENDING_MIN_MS,
    parseSearch: parseSearchWith((value) => value),
    stringifySearch: stringifySearchWith((value) => String(value)),
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
