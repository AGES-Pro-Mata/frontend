import axios from 'axios'
import type { User } from '@/types/auth.types'

// Create axios instance
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const userService = {
  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/users/profile', data)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/users/change-password', {
        currentPassword,
        newPassword,
      })
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  // Get user by ID
  async getUser(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  // Get all users (admin only)
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Update user (admin only)
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Delete user (admin only)
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/users/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      throw error
    }
  },

  // Get user dashboard stats
  async getDashboardStats(): Promise<{
    totalReservations: number
    upcomingReservations: number
    completedReservations: number
    cancelledReservations: number
  }> {
    try {
      const response = await api.get('/users/dashboard-stats')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // Get user reservations
  async getUserReservations(): Promise<any[]> {
    try {
      const response = await api.get('/users/reservations')
      return response.data
    } catch (error) {
      console.error('Error fetching user reservations:', error)
      throw error
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/users/verify-email', { token })
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/users/request-password-reset', { email })
    } catch (error) {
      console.error('Error requesting password reset:', error)
      throw error
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/users/reset-password', { token, newPassword })
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  },
}

export default userService
