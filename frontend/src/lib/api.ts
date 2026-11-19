export type Role = 'customer' | 'merchant'
export type TransactionStatus = 'pending' | 'completed' | 'rejected'

export interface User {
  id: string
  email: string
  full_name: string
  business_name: string | null
  role: Role
  is_active: boolean
  created_at: string
}

export interface Wallet {
  balance: string
  offline_spending_limit: string
  updated_at: string
}

export interface Transaction {
  id: string
  reference: string
  amount: string
  status: TransactionStatus
  note: string | null
  direction: 'in' | 'out'
  counterparty_name: string
  created_at: string
}

export interface SalesOverview {
  total_received: string
  completed_count: number
  pending_count: number
}

export interface CustomerDashboardData {
  user: User
  wallet: Wallet
  recent_transactions: Transaction[]
}

export interface MerchantDashboardData {
  user: User
  wallet: Wallet
  sales_overview: SalesOverview
  recent_transactions: Transaction[]
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: User
}

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
  role: Role
  business_name?: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

interface FieldError {
  field: string
  message: string
}

interface ErrorPayload {
  detail?: string | Array<{ msg?: string }> | unknown
  errors?: FieldError[]
}

const API_BASE_URL = (
  import.meta.env.VITE_API_URL as string | undefined
)?.replace(/\/$/, '') ?? 'http://localhost:8000/api/v1'

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldError[]

  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError('Unable to reach the GRAMPay server. Check your connection and try again.', 0)
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(messageFromPayload(payload), response.status, fieldErrorsFromPayload(payload))
  }
  return payload as T
}

function messageFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Something went wrong. Please try again.'
  }
  const error = payload as ErrorPayload
  if (typeof error.detail === 'string') {
    return error.detail
  }
  if (Array.isArray(error.detail)) {
    return error.detail.map((item) => item.msg ?? 'Invalid value').join('; ')
  }
  if (error.errors?.length) {
    return error.errors.map((item) => item.message).join('; ')
  }
  return 'Something went wrong. Please try again.'
}

function fieldErrorsFromPayload(payload: unknown): FieldError[] {
  if (!payload || typeof payload !== 'object') {
    return []
  }
  const errors = (payload as ErrorPayload).errors
  return Array.isArray(errors) ? errors : []
}

export const api = {
  register: (payload: RegisterPayload) =>
    apiFetch<User>('/auth/register', { method: 'POST', body: payload }),

  login: (payload: LoginPayload) =>
    apiFetch<TokenResponse>('/auth/login', { method: 'POST', body: payload }),

  logout: (token: string) =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST', token }),

  me: (token: string) => apiFetch<User>('/auth/me', { token }),

  customerDashboard: (token: string) =>
    apiFetch<CustomerDashboardData>('/dashboard/customer', { token }),

  merchantDashboard: (token: string) =>
    apiFetch<MerchantDashboardData>('/dashboard/merchant', { token }),

  wallet: (token: string) => apiFetch<Wallet>('/wallet/me', { token }),

  transactions: (token: string, limit = 10) =>
    apiFetch<Transaction[]>(`/transactions/me?limit=${limit}`, { token }),
}

export function dashboardPathFor(role: Role): string {
  return role === 'customer' ? '/dashboard/customer' : '/dashboard/merchant'
}

export function formatMoney(value: string | number): string {
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(amount)) {
    return '₹0.00'
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
