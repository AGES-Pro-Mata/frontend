import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Global test setup

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock fetch
global.fetch = vi.fn()

// Mock console methods to reduce noise in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Filter out React warnings we expect in tests
    const message = args[0]
    if (
      typeof message === 'string' &&
      (message.includes('Warning: ReactDOM.render is deprecated') ||
        message.includes('Warning: React.createFactory is deprecated') ||
        message.includes('Warning: componentWillReceiveProps has been renamed'))
    ) {
      return
    }
    originalError(...args)
  }

  console.warn = (...args: unknown[]) => {
    // Filter out warnings we expect in tests
    const message = args[0]
    if (
      typeof message === 'string' &&
      (message.includes('Warning: React.createFactory is deprecated') ||
        message.includes('Warning: componentWillReceiveProps has been renamed'))
    ) {
      return
    }
    originalWarn(...args)
  }
})

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
})

// Mock URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
})

// Mock FileReader
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  result: null,
  error: null,
  onload: null,
  onerror: null,
  onabort: null,
  onloadstart: null,
  onloadend: null,
  onprogress: null,
  abort: vi.fn(),
  EMPTY: 0,
  LOADING: 1,
  DONE: 2,
  readyState: 0,
}))

// Mock Blob
global.Blob = vi.fn().mockImplementation(() => ({
  size: 0,
  type: '',
  arrayBuffer: vi.fn(),
  slice: vi.fn(),
  stream: vi.fn(),
  text: vi.fn(),
}))

// Mock File
global.File = vi.fn().mockImplementation(() => ({
  lastModified: Date.now(),
  name: 'test-file.txt',
  size: 0,
  type: 'text/plain',
  webkitRelativePath: '',
  arrayBuffer: vi.fn(),
  slice: vi.fn(),
  stream: vi.fn(),
  text: vi.fn(),
}))

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn()

// Increase timeout for slow tests
vi.setConfig({ testTimeout: 10000 })

// Global test utilities
export const mockAsyncFn = <T extends (...args: any[]) => any>(
  fn?: T
): vi.MockedFunction<T> => vi.fn(fn)

export const createMockResponse = <T>(data: T, status = 200): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const createMockError = (message: string, status = 400): Response => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Test data factory helpers
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  ...overrides,
})

export const createMockAccommodation = (overrides = {}) => ({
  id: '1',
  name: 'Test Accommodation',
  description: 'Test description',
  type: 'INDIVIDUAL',
  capacity: 1,
  price: 100,
  amenities: ['Wi-Fi'],
  images: ['/test-image.jpg'],
  available: true,
  ...overrides,
})

export const createMockActivity = (overrides = {}) => ({
  id: '1',
  title: 'Test Activity',
  description: 'Test description',
  duration: 60,
  maxParticipants: 10,
  price: 50,
  difficulty: 'EASY',
  category: 'NATURE',
  images: ['/test-image.jpg'],
  schedule: [{ time: '08:00', available: true }],
  ...overrides,
})

export const createMockReservation = (overrides = {}) => ({
  id: '1',
  userId: '1',
  type: 'ACCOMMODATION',
  accommodationId: '1',
  checkIn: '2024-02-15T14:00:00Z',
  checkOut: '2024-02-17T12:00:00Z',
  guests: 1,
  totalAmount: 200,
  status: 'CONFIRMED',
  paymentStatus: 'PAID',
  createdAt: '2024-01-15T10:30:00Z',
  ...overrides,
})