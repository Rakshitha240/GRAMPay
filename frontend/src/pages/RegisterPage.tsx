import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { ApiError, dashboardPathFor } from '../lib/api'
import type { Role } from '../lib/api'
import { useAuth } from '../lib/auth'

const inputClass =
  'mt-2 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export function RegisterPage() {
  const { register, isLoading: authLoading, token, user } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('customer')
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && token && user) {
      navigate(dashboardPathFor(user.role), { replace: true })
    }
  }, [authLoading, token, user, navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setSubmitting(true)
    try {
      const createdUser = await register({
        full_name: fullName,
        email,
        password,
        role,
        business_name: role === 'merchant' ? businessName : null,
      })
      navigate(dashboardPathFor(createdUser.role), { replace: true })
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Unable to create your account right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GRAMPay as a customer or merchant and explore your dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <fieldset>
          <legend className="text-sm font-semibold text-ink-700">Account type</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['customer', 'merchant'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={role === option}
                onClick={() => setRole(option)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition ${
                  role === option
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-line bg-white text-ink-700 hover:bg-surface'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="full-name" className="text-sm font-semibold text-ink-700">
            Full name
          </label>
          <input
            id="full-name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        {role === 'merchant' ? (
          <div>
            <label htmlFor="business-name" className="text-sm font-semibold text-ink-700">
              Business name
            </label>
            <input
              id="business-name"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Shop or business name"
              className={inputClass}
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="register-email" className="text-sm font-semibold text-ink-700">
            Email address
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="text-sm font-semibold text-ink-700">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-sm font-semibold text-ink-700">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
              className={inputClass}
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
