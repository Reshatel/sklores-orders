import type { ReactNode } from 'react'
import { DoodleUnderline } from './Doodles'

export function PageTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="page-title mb-6 flex items-end gap-3">
      <h1 className="relative inline-block">
        <span className="hand block text-5xl leading-none sm:text-6xl">{children}</span>
        <DoodleUnderline className="absolute -bottom-2 left-0 h-3 w-full" />
      </h1>
      {aside}
    </div>
  )
}
