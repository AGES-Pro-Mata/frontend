import axios from 'axios'
import type { LoginCredentials, RegisterData, User } from '@/types/auth.types'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData)

      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken')

      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Don't throw error for logout, just log it
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken
      })

      return response.data
    } catch (error) {
      console.error('Token refresh error:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      throw error
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const token = localStorage.getItem('authToken')

      if (!token) {
        throw new Error('No auth token')
      }
      
      const response = await api.get<User>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email', { token })
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/request-password-reset', { email })
    } catch (error) {
      console.error('Password reset request error:', error)
      throw error
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword
      })
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const token = localStorage.getItem('authToken')

      if (!token) {
        throw new Error('No auth token')
      }
      
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  },

  // Check if token is valid
  async validateToken(token: string): Promise<boolean> {
    try {
      await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      })

      return true
    } catch (error) {
      return false
    }
  },
}

export default authService
