import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Production API URL handling
  const API_URL = import.meta.env.VITE_API_URL || ''

  // Load user from token on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser)
        // Map backend isFirstLogin to frontend needsPasswordChange
        parsedUser.needsPasswordChange = parsedUser.isFirstLogin
        setUser(parsedUser)
      }
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || 'Login failed')
      }

      // Map backend isFirstLogin to frontend needsPasswordChange
      const userWithStatus = {
        ...data.user,
        needsPasswordChange: data.user.isFirstLogin
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userWithStatus))
      setUser(userWithStatus)

      return { success: true, user: userWithStatus }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    setUser(null)
  }

  const createDoctorAccount = async (doctorData) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only administrators can create doctor accounts')
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(doctorData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed')
      }

      return data.user
    } catch (error) {
      throw error
    }
  }

  // Admin resets doctor password
  const resetDoctorPassword = async (doctorId, temporaryPassword) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/users/${doctorId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ password: temporaryPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.msg || 'Reset failed')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      throw new Error('User not logged in')
    }

    try {
      // Note: Backend endpoint for simply changing password needs verification
      // For now simulating success or implementing basic update if route exists
      // Route added in previous step: /api/auth/change-password
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ userId: user.id, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.msg || 'Password update failed')
      }

      const updatedUser = {
        ...user,
        isFirstLogin: false,
        needsPasswordChange: false
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return true
    } catch (error) {
      throw error
    }
  }

  // Fetch doctor list from backend
  const getAllDoctors = async () => {
    if (!user || user.role !== 'admin') return []

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: { 'x-auth-token': token }
      })
      if (!res.ok) throw new Error('Failed to fetch doctors')
      return await res.json()
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const activateDoctor = async (id) => {
    if (!user || user.role !== 'admin') return false

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ isActive: true })
      })
      return res.ok
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const deactivateDoctor = async (id) => {
    if (!user || user.role !== 'admin') return false

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ isActive: false })
      })
      return res.ok
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const incrementAnalysisCount = () => {
    // This would now be handled by backend aggregation
    console.log("Analysis count incremented on backend")
  }

  const value = {
    user,
    login,
    logout,
    createDoctorAccount,
    resetDoctorPassword,
    changePassword,
    getAllDoctors,
    incrementAnalysisCount,
    activateDoctor,
    deactivateDoctor,
    isAuthenticated: !!user,
    isAdmin: user && user.role === 'admin',
    isDoctor: user && user.role === 'doctor',
    canUseApp: user && (!user.isFirstLogin || user.role === 'admin'),
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

