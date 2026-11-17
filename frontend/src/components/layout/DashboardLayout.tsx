import type { ReactNode } from 'react'
import { ButtonLink } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

type DashboardLayoutProps = {
  role: 'Customer' | 'Merchant'
  title: string
  description: string
  children: ReactNode
}

export function DashboardLayout({
  role,
  title,
  description,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <Container className="flex h-20 items-center justify-between gap-4">
          <Logo to="/" />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 sm:inline-flex">
              {role} space
            </span>
            <ButtonLink to="/" variant="ghost" size="sm">
              Home
            </ButtonLink>
          </div>
        </Container>
      </header>

      <main className="py-12 sm:py-16">
        <Container>
          <div className="animate-fade-up">
            <span className="eyebrow">{role} dashboard preview</span>
            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
              {description}
            </p>
            <Card className="mt-8 p-6 sm:p-10">{children}</Card>
          </div>
        </Container>
      </main>
    </div>
  )
}
