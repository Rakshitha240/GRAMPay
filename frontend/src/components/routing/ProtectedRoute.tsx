import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { dashboardPathFor } from '../../lib/api'
import type { Role } from '../../lib/api'
import { useAuth } from '../../lib/auth'

interface ProtectedRouteProps {
  role?: Role
  children: ReactNode
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm font-medium text-ink-500">Loading your workspace…</p>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={dashboardPathFor(user.role)} replace />
  }

  return <>{children}</>
}
