import { AuthLayout } from '../components/layout/AuthLayout'
import { PhasePlaceholder } from '../components/ui/PhasePlaceholder'

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your GRAMPay account when authentication is introduced."
    >
      <PhasePlaceholder>The login form will be added in Phase 2.</PhasePlaceholder>
    </AuthLayout>
  )
}
