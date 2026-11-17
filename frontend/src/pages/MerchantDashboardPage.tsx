import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PhasePlaceholder } from '../components/ui/PhasePlaceholder'

export function MerchantDashboardPage() {
  return (
    <DashboardLayout
      role="Merchant"
      title="Merchant dashboard"
      description="A dedicated space for merchant QR codes, incoming records and sync status."
    >
      <PhasePlaceholder>
        Dashboard content will be added in Phase 2. No payment actions are
        available yet.
      </PhasePlaceholder>
    </DashboardLayout>
  )
}
