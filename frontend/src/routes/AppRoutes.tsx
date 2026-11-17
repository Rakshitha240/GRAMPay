import { Route, Routes } from 'react-router-dom'
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
      <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
      <Route path="/dashboard/merchant" element={<MerchantDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
