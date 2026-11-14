import { useRouter } from '@tanstack/react-router'
import { ErrorState } from './ErrorState'

export function RouteErrorState() {
  const router = useRouter()

  return <ErrorState onRetry={() => router.invalidate()} />
}
