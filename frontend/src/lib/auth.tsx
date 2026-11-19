import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { api, ApiError } from './api'
import type { LoginPayload, RegisterPayload, User } from './api'

const TOKEN_KEY = 'grampay.access_token'
const USER_KEY = 'grampay.user'

interface StoredSession {
  token: string | null
  user: User | null
}

function readStoredSession(): StoredSession {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY)
    const rawUser = window.localStorage.getItem(USER_KEY)
    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as User) : null,
    }
  } catch {
    return { token: null, user: null }
  }
}

function persistSession(token: string, user: User): void {
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearStoredSession(): void {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredSession().user)
  const [token, setToken] = useState<string | null>(() => readStoredSession().token)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const stored = readStoredSession()

    if (!stored.token) {
      setIsLoading(false)
      return
    }

    api
      .me(stored.token)
      .then((currentUser) => {
        if (!active) return
        setUser(currentUser)
        setToken(stored.token)
        persistSession(stored.token as string, currentUser)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof ApiError && error.status === 401) {
          clearStoredSession()
          setUser(null)
          setToken(null)
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await api.login(payload)
    persistSession(result.access_token, result.user)
    setUser(result.user)
    setToken(result.access_token)
    return result.user
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await api.register(payload)
    return login({ email: payload.email, password: payload.password })
  }, [login])

  const logout = useCallback(async () => {
    const currentToken = token
    clearStoredSession()
    setUser(null)
    setToken(null)
    if (currentToken) {
      await api.logout(currentToken).catch(() => undefined)
    }
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used inside an AuthProvider.')
  }
  return context
}
