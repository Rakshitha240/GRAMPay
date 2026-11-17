import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PhasePlaceholder } from '../components/ui/PhasePlaceholder'

export function CustomerDashboardPage() {
  return (
    <DashboardLayout
      role="Customer"
      title="Customer dashboard"
      description="A dedicated space for wallet overview, QR scanning and transaction status."
    >
      <PhasePlaceholder>
        Dashboard content will be added in Phase 2. No payment actions are
        available yet.
      </PhasePlaceholder>
    </DashboardLayout>
  )
}
