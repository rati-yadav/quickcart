import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api, setToken as persistToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem('amazone_token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('amazone_user')
    return raw ? JSON.parse(raw) : null
  })

  const setSession = useCallback((nextToken, nextUser) => {
    persistToken(nextToken)
    setTokenState(nextToken)
    setUser(nextUser)
    if (nextUser) localStorage.setItem('amazone_user', JSON.stringify(nextUser))
    else localStorage.removeItem('amazone_user')
  }, [])

  const logout = useCallback(() => {
    setSession(null, null)
  }, [setSession])

  const login = useCallback(
    async (username, password) => {
      const data = await api('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      setSession(data.token, {
        id: data.user_id,
        username: data.username,
        is_staff: Boolean(data.is_staff),
      })
      return data
    },
    [setSession],
  )

  const register = useCallback(
    async ({ username, email, password, first_name }) => {
      const data = await api('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, first_name }),
      })
      setSession(data.token, {
        id: data.user_id,
        username: data.username,
        is_staff: Boolean(data.is_staff),
      })
      return data
    },
    [setSession],
  )

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isStaff: Boolean(user?.is_staff),
      login,
      register,
      logout,
    }),
    [token, user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
