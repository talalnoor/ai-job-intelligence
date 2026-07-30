import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  function login(newToken, userData) {
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}