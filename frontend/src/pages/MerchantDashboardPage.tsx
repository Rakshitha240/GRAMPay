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
  CheckIcon,
  QrCodeIcon,
  RefreshIcon,
  WalletIcon,
} from '../components/ui/icons'
import { ApiError, api, formatMoney } from '../lib/api'
import type { MerchantDashboardData } from '../lib/api'
import { useAuth } from '../lib/auth'

export function MerchantDashboardPage() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<MerchantDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!token) return
    let active = true
    setLoading(true)
    api
      .merchantDashboard(token)
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
      role="Merchant"
      title="Merchant dashboard"
      description="Track sales, prepare QR payments and review incoming transactions."
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
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="eyebrow">Sales Overview</span>
                  <h2 className="mt-4 text-3xl font-bold text-brand-700">
                    {formatMoney(data.sales_overview.total_received)}
                  </h2>
                  <p className="mt-2 text-xs text-ink-500">
                    Completed payments received · demo data
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <CheckIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
                <div>
                  <p className="text-xs text-ink-500">Completed</p>
                  <p className="mt-1 text-lg font-bold">{data.sales_overview.completed_count}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500">Pending</p>
                  <p className="mt-1 text-lg font-bold">{data.sales_overview.pending_count}</p>
                </div>
              </div>
            </Card>

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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PhaseFeatureCard
              icon={<QrCodeIcon className="h-5 w-5" />}
              title="Generate QR"
              description="Create a payment QR code for customers to scan, even with low connectivity."
            />
            <PhaseFeatureCard
              icon={<WalletIcon className="h-5 w-5" />}
              title="Receive Payment"
              description="Accept payment records from customers and confirm them when online."
            />
          </div>

          <RecentTransactions transactions={data.recent_transactions} />
        </>
      ) : null}
    </DashboardLayout>
  )
}
