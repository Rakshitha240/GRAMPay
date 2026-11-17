import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function PhasePlaceholder({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-line bg-surface px-5 py-10 text-center text-sm leading-relaxed text-ink-500',
        className,
      )}
    >
      {children}
    </div>
  )
}
