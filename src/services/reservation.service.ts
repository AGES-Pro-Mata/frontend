import axios from 'axios'
import type { Reservation, CreateReservationDTO, UpdateReservationDTO } from '@/types/reservation.types'

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

interface ReservationStats {
  totalReservations: number
  activeReservations: number
  totalRevenue: number
  occupancyRate: number
}

interface DashboardReservation {
  id: string
  guestName: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

interface UpcomingCheckIn {
  id: string
  guestName: string
  checkIn: string
  accommodationName: string
}

export const reservationService = {
  // Get all reservations
  async getReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get('/reservations')
      return response.data
    } catch (error) {
      console.error('Error fetching reservations:', error)
      throw error
    }
  },

  // Get reservation by ID
  async getReservation(id: string): Promise<Reservation> {
    try {
      const response = await api.get(`/reservations/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching reservation:', error)
      throw error
    }
  },

  // Create new reservation
  async createReservation(data: CreateReservationDTO): Promise<Reservation> {
    try {
      const response = await api.post('/reservations', data)
      return response.data
    } catch (error) {
      console.error('Error creating reservation:', error)
      throw error
    }
  },

  // Update reservation
  async updateReservation(id: string, data: UpdateReservationDTO): Promise<Reservation> {
    try {
      const response = await api.put(`/reservations/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating reservation:', error)
      throw error
    }
  },

  // Delete reservation
  async deleteReservation(id: string): Promise<void> {
    try {
      await api.delete(`/reservations/${id}`)
    } catch (error) {
      console.error('Error deleting reservation:', error)
      throw error
    }
  },

  // Cancel reservation
  async cancelReservation(id: string): Promise<Reservation> {
    try {
      const response = await api.patch(`/reservations/${id}/cancel`)
      return response.data
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      throw error
    }
  },

  // Confirm reservation
  async confirmReservation(id: string): Promise<Reservation> {
    try {
      const response = await api.patch(`/reservations/${id}/confirm`)
      return response.data
    } catch (error) {
      console.error('Error confirming reservation:', error)
      throw error
    }
  },

  // Get reservation statistics
  async getStats(): Promise<ReservationStats> {
    try {
      const response = await api.get('/reservations/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching reservation stats:', error)
      throw error
    }
  },

  // Get recent reservations for dashboard
  async getRecentReservations(limit = 10): Promise<DashboardReservation[]> {
    try {
      const response = await api.get(`/reservations/recent?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching recent reservations:', error)
      throw error
    }
  },

  // Get upcoming check-ins
  async getUpcomingCheckIns(days = 7): Promise<UpcomingCheckIn[]> {
    try {
      const response = await api.get(`/reservations/upcoming-checkins?days=${days}`)
      return response.data
    } catch (error) {
      console.error('Error fetching upcoming check-ins:', error)
      throw error
    }
  },

  // Get reservations by accommodation
  async getReservationsByAccommodation(accommodationId: string): Promise<Reservation[]> {
    try {
      const response = await api.get(`/reservations/accommodation/${accommodationId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching reservations by accommodation:', error)
      throw error
    }
  },

  // Get reservations by date range
  async getReservationsByDateRange(startDate: string, endDate: string): Promise<Reservation[]> {
    try {
      const response = await api.get(`/reservations/date-range?start=${startDate}&end=${endDate}`)
      return response.data
    } catch (error) {
      console.error('Error fetching reservations by date range:', error)
      throw error
    }
  },

  // Check availability
  async checkAvailability(accommodationId: string, checkIn: string, checkOut: string): Promise<boolean> {
    try {
      const response = await api.get(`/reservations/availability?accommodation=${accommodationId}&checkIn=${checkIn}&checkOut=${checkOut}`)
      return response.data.available
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  },
}

export default reservationService
