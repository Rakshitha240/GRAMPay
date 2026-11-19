import type { ReactNode } from 'react'
import { Button, ButtonLink } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import type { User } from '../../lib/api'

type DashboardLayoutProps = {
  role: 'Customer' | 'Merchant'
  title: string
  description: string
  user: User
  onLogout: () => void
  children: ReactNode
}

export function DashboardLayout({
  role,
  title,
  description,
  user,
  onLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <Container className="flex h-20 items-center justify-between gap-4">
          <Logo to="/" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink-900">{user.full_name}</p>
              <p className="text-xs text-ink-500">{user.email}</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              {role} space
            </span>
            <ButtonLink to="/" variant="ghost" size="sm">
              Home
            </ButtonLink>
            <Button variant="secondary" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </Container>
      </header>

      <main className="py-10 sm:py-14">
        <Container>
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="eyebrow">{role} dashboard</span>
                <h1 className="mt-5 text-3xl font-bold sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
                  {description}
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-6">{children}</div>
          </div>
        </Container>
      </main>
    </div>
  )
}

export function DashboardCard({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        {hint ? <span className="text-xs text-ink-500">{hint}</span> : null}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  )
}
