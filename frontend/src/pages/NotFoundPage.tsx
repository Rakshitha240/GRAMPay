import { ButtonLink } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-surface px-5 text-center">
      <Logo />
      <div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          The page you are looking for does not exist.
        </p>
      </div>
      <ButtonLink to="/" size="sm">
        Back to home
      </ButtonLink>
    </div>
  )
}
