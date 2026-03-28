import { createContext, useState, useEffect } from 'react'
import { loginUser } from '../api/authApi'
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = getItem(STORAGE_KEYS.AUTH)

    if (saved?.token && saved?.user) {
      setUser(saved.user)
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    const { token, user: userData } = await loginUser(credentials)

    setItem(STORAGE_KEYS.AUTH, { token, user: userData })
    setUser(userData)
  }

  const logout = () => {
    removeItem(STORAGE_KEYS.AUTH)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}