import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { ApiError, dashboardPathFor } from '../lib/api'
import { useAuth } from '../lib/auth'

const DEMO_ACCOUNTS = [
  { label: 'Customer demo', email: 'customer@grampay.demo' },
  { label: 'Merchant demo', email: 'merchant@grampay.demo' },
]
const DEMO_PASSWORD = 'Demo@1234'

export function LoginPage() {
  const { login, isLoading: authLoading, token, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from

  useEffect(() => {
    if (!authLoading && token && user) {
      navigate(dashboardPathFor(user.role), { replace: true })
    }
  }, [authLoading, token, user, navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const loggedInUser = await login({ email, password })
      navigate(from ?? dashboardPathFor(loggedInUser.role), { replace: true })
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Unable to log in right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your GRAMPay customer or merchant workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-ink-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold text-ink-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Log in'}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-line bg-surface px-4 py-4">
        <p className="text-xs font-semibold text-ink-700">Demo accounts</p>
        <p className="mt-1 text-xs text-ink-500">
          Password for both accounts: <span className="font-semibold">{DEMO_PASSWORD}</span>
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setEmail(account.email)
                setPassword(DEMO_PASSWORD)
                setError(null)
              }}
              className="rounded-xl border border-line bg-white px-3 py-2 text-left text-xs font-semibold text-ink-700 transition hover:border-brand-400 hover:bg-brand-50"
            >
              {account.label}
              <span className="mt-0.5 block truncate font-normal text-ink-500">
                {account.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        New to GRAMPay?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
