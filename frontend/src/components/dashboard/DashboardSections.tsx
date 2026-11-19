import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { formatDateTime, formatMoney } from '../../lib/api'
import type { Transaction, Wallet } from '../../lib/api'

export function WalletSummary({ wallet }: { wallet: Wallet }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="overflow-hidden p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
          Available balance
        </p>
        <p className="mt-3 text-3xl font-bold text-brand-700">
          {formatMoney(wallet.balance)}
        </p>
        <p className="mt-2 text-xs text-ink-500">Demo wallet · simulated funds</p>
      </Card>
      <Card className="overflow-hidden p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
          Offline spending limit
        </p>
        <p className="mt-3 text-3xl font-bold text-ink-900">
          {formatMoney(wallet.offline_spending_limit)}
        </p>
        <p className="mt-2 text-xs text-ink-500">Maximum per offline session</p>
      </Card>
    </div>
  )
}

const statusStyles: Record<Transaction['status'], string> = {
  completed: 'bg-brand-50 text-brand-700',
  pending: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-700',
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">Recent transactions</h2>
        <span className="text-xs text-ink-500">Latest {transactions.length}</span>
      </div>

      {transactions.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-surface-muted px-4 py-6 text-center text-sm text-ink-500">
          No transactions yet.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-line">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {transaction.direction === 'in' ? 'From ' : 'To '}
                  {transaction.counterparty_name}
                </p>
                <p className="mt-1 truncate text-xs text-ink-500">
                  {transaction.note ?? transaction.reference} ·{' '}
                  {formatDateTime(transaction.created_at)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-sm font-bold ${
                    transaction.direction === 'in' ? 'text-brand-700' : 'text-ink-900'
                  }`}
                >
                  {transaction.direction === 'in' ? '+' : '−'}
                  {formatMoney(transaction.amount)}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-semibold capitalize ${statusStyles[transaction.status]}`}
                >
                  {transaction.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function PhaseFeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          {icon}
        </span>
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-500">
          Phase 3
        </span>
      </div>
      <h3 className="mt-5 text-sm font-bold">{title}</h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-500">{description}</p>
      <Button variant="secondary" size="sm" className="mt-5 w-full" disabled>
        Coming soon
      </Button>
    </Card>
  )
}
