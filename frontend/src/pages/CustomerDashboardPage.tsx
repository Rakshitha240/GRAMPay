import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PhaseFeatureCard,
  RecentTransactions,
  WalletSummary,
} from '../components/dashboard/DashboardSections'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  ArrowUpRightIcon,
  QrCodeIcon,
  NetworkIcon,
  RefreshIcon,
  SignalOffIcon,
} from '../components/ui/icons'
import { ApiError, api } from '../lib/api'
import type { CustomerDashboardData } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useConnectivity } from '../hooks/useConnectivity'

export function CustomerDashboardPage() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const online = useConnectivity()
  const [data, setData] = useState<CustomerDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!token) return
    let active = true
    setLoading(true)
    api
      .customerDashboard(token)
      .then((result) => {
        if (active) {
          setData(result)
          setError(null)
        }
      })
      .catch((cause: unknown) => {
        if (!active) return
        if (cause instanceof ApiError && cause.status === 401) {
          void logout().then(() => {
            if (active) navigate('/login', { replace: true })
          })
          return
        }
        setError(
          cause instanceof ApiError ? cause.message : 'Unable to load your dashboard.',
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [token, reloadKey, logout, navigate])

  if (!user) return null

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <DashboardLayout
      role="Customer"
      title="Customer dashboard"
      description="Review your demo wallet, prepare payments and track recent activity."
      user={user}
      onLogout={() => void handleLogout()}
    >
      {error ? (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
          <p role="alert" className="text-sm text-red-700">{error}</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
              <RefreshIcon className="h-4 w-4" /> Retry
            </Button>
            <ButtonLink to="/login" size="sm">Log in again</ButtonLink>
          </div>
        </Card>
      ) : null}

      {loading && !data ? (
        <Card className="p-10 text-center text-sm text-ink-500">Loading dashboard…</Card>
      ) : null}

      {data ? (
        <>
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">My Wallet</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                <RefreshIcon className="h-4 w-4" /> Refresh
              </Button>
            </div>
            <WalletSummary wallet={data.wallet} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PhaseFeatureCard
              icon={<ArrowUpRightIcon className="h-5 w-5" />}
              title="Send Payment"
              description="Create a payment for a merchant and exchange the record even while offline."
            />
            <PhaseFeatureCard
              icon={<QrCodeIcon className="h-5 w-5" />}
              title="Scan QR"
              description="Scan a merchant QR code to start a payment without typing details."
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <RecentTransactions transactions={data.recent_transactions} />
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    {online ? (
                      <NetworkIcon className="h-5 w-5" />
                    ) : (
                      <SignalOffIcon className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <h2 className="text-base font-bold">Connectivity Status</h2>
                    <p className="text-xs text-ink-500">Live browser connection state</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${online ? 'bg-brand-500' : 'bg-amber-500'}`}
                  />
                  <span className="text-sm font-semibold">
                    {online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Offline payments can be created now. Records are verified when connectivity
                  returns in a later phase.
                </p>
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-bold">Quick links</h2>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">
                  Need the full history or a wallet refresh? Use the controls below.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setReloadKey((key) => key + 1)}
                  >
                    <RefreshIcon className="h-4 w-4" /> Refresh data
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  )
}
