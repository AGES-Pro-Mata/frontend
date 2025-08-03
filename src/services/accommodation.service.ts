import axios from 'axios'

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

import type {
  Accommodation,
  AccommodationFilters,
  AccommodationAvailability,
  CreateAccommodationDTO,
  UpdateAccommodationDTO,
  PaginatedResponse,
} from '@/types/accommodation.types'
import { AccommodationType } from '@/types/accommodation.types'

// Constants for accommodation types
export const ACCOMMODATION_TYPES = [
  { value: AccommodationType.HOTEL, label: 'Hotel' },
  { value: AccommodationType.APARTMENT, label: 'Apartamento' },
  { value: AccommodationType.HOUSE, label: 'Casa' },
  { value: AccommodationType.ROOM, label: 'Quarto' },
  { value: AccommodationType.HOSTEL, label: 'Hostel' },
  { value: AccommodationType.RESORT, label: 'Resort' },
  { value: AccommodationType.VILLA, label: 'Vila' },
  { value: AccommodationType.CABIN, label: 'Cabana' },
  { value: AccommodationType.OTHER, label: 'Outro' },
] as const

export class AccommodationService {
  private readonly baseUrl = '/accommodations'

  /**
   * Get all accommodations with optional filtering and pagination
   */
  async getAll(params?: {
    page?: number
    limit?: number
    filters?: AccommodationFilters
  }): Promise<PaginatedResponse<Accommodation>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    // Add filters
    if (params?.filters) {
      const { type, minPrice, maxPrice, amenities } = params.filters

      if (type) searchParams.set('type', Array.isArray(type) ? type.join(',') : type)
      if (minPrice !== undefined) searchParams.set('minPrice', minPrice.toString())
      if (maxPrice !== undefined) searchParams.set('maxPrice', maxPrice.toString())
      if (amenities?.length) searchParams.set('amenities', amenities.join(','))
    }

    const response = await api.get<PaginatedResponse<Accommodation>>(
      `${this.baseUrl}?${searchParams.toString()}`
    )
    
    return response.data
  }

  /**
   * Get a specific accommodation by ID
   */
  async getById(id: string): Promise<Accommodation> {
    const response = await api.get<Accommodation>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Search accommodations by text query
   */
  async search(query: string, filters?: AccommodationFilters): Promise<Accommodation[]> {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(','))
          } else {
            searchParams.set(key, value.toString())
          }
        }
      })
    }

    const response = await api.get<Accommodation[]>(
      `${this.baseUrl}/search?${searchParams.toString()}`
    )
    
    return response.data
  }

  /**
   * Get accommodation availability for specific dates
   */
  async getAvailability(
    accommodationId: string,
    startDate: string,
    endDate: string
  ): Promise<AccommodationAvailability> {
    const response = await api.get<AccommodationAvailability>(
      `${this.baseUrl}/${accommodationId}/availability`,
      {
        params: { startDate, endDate }
      }
    )
    
    return response.data
  }

  /**
   * Check availability for multiple accommodations
   */
  async checkBulkAvailability(
    accommodationIds: string[],
    startDate: string,
    endDate: string
  ): Promise<Record<string, AccommodationAvailability>> {
    const response = await api.post<Record<string, AccommodationAvailability>>(
      `${this.baseUrl}/availability/bulk`,
      {
        accommodationIds,
        startDate,
        endDate
      }
    )
    
    return response.data
  }

  /**
   * Get featured accommodations
   */
  async getFeatured(): Promise<Accommodation[]> {
    const response = await api.get<Accommodation[]>(`${this.baseUrl}/featured`)
    return response.data
  }

  /**
   * Get accommodations by type
   */
  async getByType(type: string): Promise<Accommodation[]> {
    const response = await api.get<Accommodation[]>(`${this.baseUrl}/type/${type}`)
    return response.data
  }

  /**
   * Get similar accommodations
   */
  async getSimilar(accommodationId: string, limit = 4): Promise<Accommodation[]> {
    const response = await api.get<Accommodation[]>(
      `${this.baseUrl}/${accommodationId}/similar`,
      { params: { limit } }
    )
    
    return response.data
  }

  /**
   * Create new accommodation (Admin only)
   */
  async create(data: CreateAccommodationDTO): Promise<Accommodation> {
    const response = await api.post<Accommodation>(this.baseUrl, data)
    return response.data
  }

  /**
   * Update accommodation (Admin only)
   */
  async update(id: string, data: UpdateAccommodationDTO): Promise<Accommodation> {
    const response = await api.put<Accommodation>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Delete accommodation (Admin only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Upload accommodation images
   */
  async uploadImages(id: string, files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`images`, file)
    })

    const response = await api.post<{ urls: string[] }>(
      `${this.baseUrl}/${id}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.urls
  }

  /**
   * Delete accommodation image
   */
  async deleteImage(id: string, imageUrl: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}/images`, {
      data: { imageUrl }
    })
  }

  /**
   * Get accommodation statistics (Admin only)
   */
  async getStatistics(id: string, period?: 'week' | 'month' | 'year'): Promise<{
    totalReservations: number
    occupancyRate: number
    revenue: number
    averageRating: number
    reviewCount: number
  }> {
    const response = await api.get(`${this.baseUrl}/${id}/statistics`, {
      params: { period }
    })
    
    return response.data
  }

  /**
   * Get accommodation reviews
   */
  async getReviews(id: string, page = 1, limit = 10): Promise<PaginatedResponse<{
    id: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: string
  }>> {
    const response = await api.get(`${this.baseUrl}/${id}/reviews`, {
      params: { page, limit }
    })
    
    return response.data
  }

  /**
   * Add review to accommodation
   */
  async addReview(id: string, review: {
    rating: number
    comment?: string
  }): Promise<void> {
    await api.post(`${this.baseUrl}/${id}/reviews`, review)
  }

  /**
   * Report accommodation issue
   */
  async reportIssue(id: string, issue: {
    type: 'maintenance' | 'cleaning' | 'amenity' | 'other'
    description: string
    priority: 'low' | 'medium' | 'high'
  }): Promise<void> {
    await api.post(`${this.baseUrl}/${id}/issues`, issue)
  }

  /**
   * Get accommodation calendar data
   */
  async getCalendar(id: string, year: number, month: number): Promise<{
    date: string
    available: boolean
    price: number
    minStay?: number
    maxStay?: number
  }[]> {
    const response = await api.get(`${this.baseUrl}/${id}/calendar`, {
      params: { year, month }
    })
    
    return response.data
  }

  /**
   * Update accommodation pricing
   */
  async updatePricing(id: string, pricing: {
    basePrice: number
    seasonalRates?: Array<{
      name: string
      startDate: string
      endDate: string
      multiplier: number
    }>
    weekendMultiplier?: number
    minimumStay?: number
    maximumStay?: number
  }): Promise<void> {
    await api.put(`${this.baseUrl}/${id}/pricing`, pricing)
  }

  /**
   * Bulk operations for admin
   */
  async bulkUpdate(updates: Array<{
    id: string
    data: Partial<UpdateAccommodationDTO>
  }>): Promise<void> {
    await api.post(`${this.baseUrl}/bulk-update`, { updates })
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await api.post(`${this.baseUrl}/bulk-delete`, { ids })
  }

  /**
   * Export accommodations data
   */
  async exportData(format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export`, {
      params: { format },
      responseType: 'blob'
    })
    
    return response.data
  }

  /**
   * Import accommodations data
   */
  async importData(file: File): Promise<{
    imported: number
    errors: Array<{ row: number; error: string }>
  }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(`${this.baseUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }
}

// Create singleton instance
export const accommodationService = new AccommodationService()

// Export default for easier importing
export default accommodationService

// Helper functions for common operations
export const accommodationHelpers = {
  /**
   * Format accommodation price with currency
   */
  formatPrice: (price: number, currency = 'BRL'): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(price)
  },

  /**
   * Get accommodation type display name
   */
  getTypeDisplayName: (type: string): string => {
    const typeNames: Record<string, string> = {
      hotel: 'Hotel',
      apartment: 'Apartamento',
      house: 'Casa',
      room: 'Quarto',
      hostel: 'Hostel',
      resort: 'Resort',
      villa: 'Vila',
      cabin: 'Cabana',
      other: 'Outro',
    }
    
    return typeNames[type] || type
  },

  /**
   * Calculate total nights between dates
   */
  calculateNights: (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  /**
   * Calculate total price for a stay
   */
  calculateTotalPrice: (
    accommodation: Accommodation,
    startDate: string,
    endDate: string,
    guests = 1
  ): number => {
    const nights = accommodationHelpers.calculateNights(startDate, endDate)
    const basePrice = accommodation.price * nights
    
    // Add guest surcharge if capacity exceeded
    const extraGuests = Math.max(0, guests - accommodation.capacity)
    const guestSurcharge = extraGuests * accommodation.price * 0.5 * nights
    
    return basePrice + guestSurcharge
  },

  /**
   * Check if accommodation meets requirements
   */
  meetsRequirements: (
    accommodation: Accommodation,
    requirements: {
      minCapacity?: number
      requiredAmenities?: string[]
      maxPrice?: number
    }
  ): boolean => {
    const { minCapacity, requiredAmenities, maxPrice } = requirements
    
    if (minCapacity && accommodation.capacity < minCapacity) return false
    if (maxPrice && accommodation.price > maxPrice) return false
    if (requiredAmenities?.length) {
      const hasAllAmenities = requiredAmenities.every(amenity =>
        accommodation.amenities.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }
    
    return true
  },

  /**
   * Get accommodation image with fallback
   */
  getImageUrl: (accommodation: Accommodation, index = 0): string => {
    const defaultImage = '/images/accommodations/default.jpg'
    
    if (!accommodation.images?.length) return defaultImage
    
    return accommodation.images[index] || accommodation.images[0] || defaultImage
  },

  /**
   * Generate accommodation slug for URLs
   */
  generateSlug: (accommodation: Accommodation): string => {
    return accommodation.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  },
}