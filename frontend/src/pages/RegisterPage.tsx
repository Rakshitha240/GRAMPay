import { AuthLayout } from '../components/layout/AuthLayout'
import { PhasePlaceholder } from '../components/ui/PhasePlaceholder'

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GRAMPay as a customer or merchant. Registration opens in the next phase."
    >
      <PhasePlaceholder>
        The registration form will be added in Phase 2.
      </PhasePlaceholder>
    </AuthLayout>
  )
}
