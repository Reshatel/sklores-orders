import { Button } from '@mantine/core'
import { DoodleCloud } from './Doodles'

type ErrorStateProps = {
  onRetry?: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="error-state sticker pop-in flex flex-col items-center gap-2 px-6 py-8 text-center">
      <DoodleCloud className="float-gently h-24 w-28" />
      <p className="hand text-3xl">Хмарка не відповідає</p>
      <p className="font-semibold text-[var(--ink-soft)]">Не вдалося завантажити дані. Спробуйте ще раз.</p>
      {onRetry && (
        <Button mt="sm" variant="danger" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      )}
    </div>
  )
}
