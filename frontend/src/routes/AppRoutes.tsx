import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/routing/ProtectedRoute'
import { CustomerDashboardPage } from '../pages/CustomerDashboardPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { MerchantDashboardPage } from '../pages/MerchantDashboardPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterPage } from '../pages/RegisterPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={<Navigate to="/dashboard/customer" replace />}
      />
      <Route
        path="/dashboard/customer"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/merchant"
        element={
          <ProtectedRoute role="merchant">
            <MerchantDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
