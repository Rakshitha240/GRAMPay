import type { ReactNode } from 'react'
import { ButtonLink } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-line bg-white">
        <Container className="flex h-20 items-center justify-between">
          <Logo to="/" />
          <ButtonLink to="/" variant="ghost" size="sm">
            Back to home
          </ButtonLink>
        </Container>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-md animate-fade-up">
          <Card className="p-8 sm:p-10">
            <span className="eyebrow">Secure access</span>
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {subtitle}
            </p>
            <div className="mt-8">{children}</div>
          </Card>
          <p className="mt-5 text-center text-xs text-ink-500">
            Demo accounts are available on the login screen.
          </p>
        </div>
      </main>
    </div>
  )
}
