import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('geopermit_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('geopermit_token', data.token)
      localStorage.setItem('geopermit_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    localStorage.removeItem('geopermit_token')
    localStorage.removeItem('geopermit_user')
    setUser(null)
  }

  const roleName = user?.role?.role_name ?? user?.role_name
  const isAdmin = roleName === 'System Administrator'
  const isPersonnel = roleName === 'MEO Personnel'
  const isManagement = roleName === 'MEO Management'
  const canEdit = isAdmin || isPersonnel

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isPersonnel, isManagement, canEdit }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
