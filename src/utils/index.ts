import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const dateUtils = {
  /**
   * Format date to Brazilian format
   */
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options,
    })
  },

  /**
   * Format date and time
   */
  formatDateTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  /**
   * Get relative time (e.g., "2 days ago")
   */
  getRelativeTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return 'agora mesmo'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dias atrás`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} meses atrás`
    return `${Math.floor(diffInSeconds / 31536000)} anos atrás`
  },

  /**
   * Check if date is today
   */
  isToday: (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    return dateObj.toDateString() === today.toDateString()
  },

  /**
   * Add days to date
   */
  addDays: (date: string | Date, days: number): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    dateObj.setDate(dateObj.getDate() + days)
    return dateObj
  },

  /**
   * Calculate days between dates
   */
  daysBetween: (start: string | Date, end: string | Date): number => {
    const startObj = typeof start === 'string' ? new Date(start) : start
    const endObj = typeof end === 'string' ? new Date(end) : end
    const diffTime = Math.abs(endObj.getTime() - startObj.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  /**
   * Check if date is valid
   */
  isValidDate: (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime())
  },

  /**
   * Format date for input[type="date"]
   */
  formatForInput: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().split('T')[0]
  },
}

// Currency utilities
export const currencyUtils = {
  /**
   * Format currency in Brazilian Real
   */
  formatBRL: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  },

  /**
   * Format currency with custom options
   */
  format: (value: number, currency = 'BRL', locale = 'pt-BR'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value)
  },

  /**
   * Parse currency string to number
   */
  parse: (value: string): number => {
    return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
  },
}

// String utilities
export const stringUtils = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  /**
   * Convert to title case
   */
  titleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  /**
   * Generate slug from string
   */
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens
      .trim()
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str
    return str.substring(0, length - suffix.length) + suffix
  },

  /**
   * Extract initials from name
   */
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  },

  /**
   * Mask CPF
   */
  maskCPF: (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4')
  },

  /**
   * Mask phone number
   */
  maskPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return phone
  },

  /**
   * Validate email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate CPF
   */
  isValidCPF: (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i)
    }
    let checkDigit = 11 - (sum % 11)
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0
    if (checkDigit !== parseInt(cleaned.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i)
    }
    checkDigit = 11 - (sum % 11)
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0
    return checkDigit === parseInt(cleaned.charAt(10))
  },
}

// Array utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   */
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)]
  },

  /**
   * Group array by key
   */
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  /**
   * Sort array by multiple keys
   */
  sortBy: <T>(array: T[], ...keys: (keyof T)[]): T[] => {
    return [...array].sort((a, b) => {
      for (const key of keys) {
        if (a[key] < b[key]) return -1
        if (a[key] > b[key]) return 1
      }
      return 0
    })
  },

  /**
   * Find item by property
   */
  findBy: <T, K extends keyof T>(array: T[], key: K, value: T[K]): T | undefined => {
    return array.find(item => item[key] === value)
  },
}

// File utilities
export const fileUtils = {
  /**
   * Format file size
   */
  formatSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Get file extension
   */
  getExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  },

  /**
   * Check if file is image
   */
  isImage: (file: File): boolean => {
    return file.type.startsWith('image/')
  },

  /**
   * Check if file is PDF
   */
  isPDF: (file: File): boolean => {
    return file.type === 'application/pdf'
  },

  /**
   * Read file as data URL
   */
  readAsDataURL: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * Validate file type
   */
  validateType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  },

  /**
   * Validate file size
   */
  validateSize: (file: File, maxSizeInMB: number): boolean => {
    const maxSize = maxSizeInMB * 1024 * 1024
    return file.size <= maxSize
  },
}

// URL utilities
export const urlUtils = {
  /**
   * Get query parameters as object
   */
  getParams: (url?: string): Record<string, string> => {
    const searchParams = new URLSearchParams(url || window.location.search)
    const params: Record<string, string> = {}
    for (const [key, value] of searchParams) {
      params[key] = value
    }
    return params
  },

  /**
   * Build URL with query parameters
   */
  buildUrl: (baseUrl: string, params: Record<string, any>): string => {
    const url = new URL(baseUrl, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
    return url.toString()
  },

  /**
   * Check if URL is external
   */
  isExternal: (url: string): boolean => {
    try {
      const urlObj = new URL(url, window.location.origin)
      return urlObj.hostname !== window.location.hostname
    } catch {
      return false
    }
  },
}

// Local storage utilities with error handling
export const storageUtils = {
  /**
   * Set item in localStorage
   */
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Failed to set localStorage item:', error)
      return false
    }
  },

  /**
   * Get item from localStorage
   */
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Failed to get localStorage item:', error)
      return defaultValue
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove localStorage item:', error)
      return false
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  },
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Generate random ID
export const generateId = (length = 8): string => {
  return Math.random().toString(36).substring(2, length + 2)
}

// Retry utility
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  throw new Error('Max attempts reached')
}

// Environment utilities
export const envUtils = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  getEnv: (key: string, defaultValue?: string): string => {
    return import.meta.env[key] || defaultValue || ''
  },
}