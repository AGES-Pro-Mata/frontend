// Accommodation types
export interface Accommodation {
  id: string
  name: string
  description: string
  type: AccommodationType
  status: AccommodationStatus
  address: Address
  location: Location
  amenities: string[]
  capacity: number
  pricing: Pricing
  images: string[]
  availability: AccommodationAvailability
  owner: {
    id: string
    name: string
    email: string
    phone?: string
  }
  ratings: {
    average: number
    count: number
  }
  rating?: number // For backward compatibility
  price: number // Direct price field
  available?: boolean // Quick availability check
  policies: AccommodationPolicies
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Location {
  latitude: number
  longitude: number
  timezone?: string
}

export interface Capacity {
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
}

export interface Pricing {
  basePrice: number
  currency: string
  taxRate?: number
  cleaningFee?: number
  serviceFee?: number
  minimumStay?: number
  maximumStay?: number
}

export interface AccommodationImage {
  id: string
  url: string
  alt?: string
  caption?: string
  isPrimary: boolean
  order: number
}

export interface AccommodationAvailability {
  isAvailable: boolean
  availableFrom?: string
  availableTo?: string
  blockedDates?: string[]
  minimumAdvanceBooking?: number
  maximumAdvanceBooking?: number
}

export interface AccommodationPolicies {
  checkInTime: string
  checkOutTime: string
  cancellationPolicy: CancellationPolicy
  smokingAllowed: boolean
  petsAllowed: boolean
  partiesAllowed: boolean
  additionalRules?: string[]
}

export enum AccommodationType {
  HOTEL = 'hotel',
  APARTMENT = 'apartment',
  HOUSE = 'house',
  ROOM = 'room',
  HOSTEL = 'hostel',
  RESORT = 'resort',
  VILLA = 'villa',
  CABIN = 'cabin',
  OTHER = 'other',
}

export enum AccommodationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DRAFT = 'draft',
}

export enum CancellationPolicy {
  FLEXIBLE = 'flexible',
  MODERATE = 'moderate',
  STRICT = 'strict',
  SUPER_STRICT = 'super_strict',
  NON_REFUNDABLE = 'non_refundable',
}

// Filter and search types
export interface AccommodationFilters {
  type?: AccommodationType
  city?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  minGuests?: number
  maxGuests?: number
  capacity?: number
  amenities?: string[]
  checkIn?: string
  checkOut?: string
  rating?: number
  instantBook?: boolean
  petFriendly?: boolean
  smokingAllowed?: boolean
  available?: boolean
  search?: string
}

export interface AccommodationSearchParams {
  query?: string
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  page?: number
  limit?: number
  sortBy?: AccommodationSortBy
  sortOrder?: 'asc' | 'desc'
}

export enum AccommodationSortBy {
  PRICE = 'price',
  RATING = 'rating',
  DISTANCE = 'distance',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

// DTO types for API operations
export interface CreateAccommodationDTO {
  name: string
  description: string
  type: AccommodationType
  address: Address
  location: Location
  amenities: string[]
  capacity: Capacity
  pricing: Omit<Pricing, 'currency'>
  images?: Omit<AccommodationImage, 'id' | 'order'>[]
  policies: AccommodationPolicies
  availability?: Omit<AccommodationAvailability, 'isAvailable'>
}

export interface UpdateAccommodationDTO {
  name?: string
  description?: string
  type?: AccommodationType
  address?: Partial<Address>
  location?: Location
  amenities?: string[]
  capacity?: Partial<Capacity>
  pricing?: Partial<Omit<Pricing, 'currency'>>
  policies?: Partial<AccommodationPolicies>
  availability?: Partial<AccommodationAvailability>
  status?: AccommodationStatus
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}