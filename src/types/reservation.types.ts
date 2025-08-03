import type { Accommodation } from './accommodation.types'
import type { User } from './auth.types'

// Base reservation types
export interface Reservation {
  id: string
  userId: string
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'>
  
  // Accommodation or Activity reservation
  type: ReservationType
  accommodationId?: string
  accommodation?: Pick<Accommodation, 'id' | 'name' | 'type' | 'images'>
  activityId?: string
  activity?: {
    id: string
    title: string
    description: string
    duration: number
  }
  
  // Dates and guests
  checkIn: string
  checkOut: string
  guests: number
  children?: number
  
  // Pricing
  baseAmount: number
  discountAmount?: number
  taxAmount?: number
  feeAmount?: number
  totalAmount: number
  currency: string
  
  // Status and workflow
  status: ReservationStatus
  paymentStatus: PaymentStatus
  
  // Additional information
  specialRequests?: string
  notes?: string
  confirmationCode?: string
  
  // Payment information
  paymentMethod?: PaymentMethod
  paymentDetails?: PaymentDetails
  
  // Dates
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  cancelledAt?: string
  checkedInAt?: string
  checkedOutAt?: string
}

export type ReservationType = 'ACCOMMODATION' | 'ACTIVITY' | 'PACKAGE'

export type ReservationStatus = 
  | 'PENDING'           // Aguardando pagamento
  | 'CONFIRMED'         // Confirmada e paga
  | 'CHECKED_IN'        // Hóspede fez check-in
  | 'CHECKED_OUT'       // Hóspede fez check-out
  | 'CANCELLED'         // Cancelada
  | 'NO_SHOW'           // Não compareceu
  | 'EXPIRED'           // Expirou sem pagamento

export type PaymentStatus = 
  | 'PENDING'           // Aguardando pagamento
  | 'PROCESSING'        // Processando pagamento
  | 'PAID'              // Pago
  | 'PARTIALLY_PAID'    // Parcialmente pago
  | 'FAILED'            // Pagamento falhou
  | 'REFUNDED'          // Reembolsado
  | 'REFUNDING'         // Processando reembolso

export type PaymentMethod = 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD'
  | 'PIX' 
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'VOUCHER'

export interface PaymentDetails {
  method: PaymentMethod
  cardLast4?: string
  cardBrand?: string
  pixKey?: string
  bankAccount?: string
  voucherCode?: string
  transactionId?: string
  receiptUrl?: string
  installments?: number
}

// Guest information for reservations
export interface GuestInfo {
  name: string
  email: string
  phone: string
  document: string
  documentType: 'CPF' | 'RG' | 'PASSPORT'
  birthDate?: string
  nationality?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

// Reservation pricing breakdown
export interface ReservationPricing {
  nights: number
  basePrice: number
  seasonalMultiplier?: number
  weekendMultiplier?: number
  holidayMultiplier?: number
  discounts: Array<{
    type: 'EARLY_BIRD' | 'LAST_MINUTE' | 'LOYALTY' | 'COUPON' | 'BULK'
    name: string
    amount: number
    percentage?: number
  }>
  fees: Array<{
    type: 'CLEANING' | 'SERVICE' | 'TOURISM' | 'BOOKING'
    name: string
    amount: number
    percentage?: number
  }>
  taxes: Array<{
    type: 'VAT' | 'CITY_TAX' | 'TOURISM_TAX'
    name: string
    amount: number
    percentage?: number
  }>
  total: number
}

// DTOs for API operations
export interface CreateReservationDTO {
  accommodationId?: string
  activityId?: string
  checkIn: string
  checkOut: string
  guests: number
  children?: number
  guestInfo: GuestInfo
  specialRequests?: string
  paymentMethod: PaymentMethod
  couponCode?: string
}

export interface UpdateReservationDTO {
  checkIn?: string
  checkOut?: string
  guests?: number
  children?: number
  specialRequests?: string
  notes?: string
}

export interface CancelReservationDTO {
  reason: string
  refundAmount?: number
}

// Reservation filters for search and listing
export interface ReservationFilters {
  status?: ReservationStatus[]
  paymentStatus?: PaymentStatus[]
  type?: ReservationType[]
  accommodationType?: string
  dateFrom?: string
  dateTo?: string
  guestName?: string
  confirmationCode?: string
  minAmount?: number
  maxAmount?: number
  createdFrom?: string
  createdTo?: string
}

// Check-in/Check-out data
export interface CheckInData {
  reservationId: string
  actualCheckIn: string
  guestInfo: GuestInfo
  additionalGuests?: GuestInfo[]
  roomAssignment?: string
  keyCardNumbers?: string[]
  parkingSpot?: string
  notes?: string
}

export interface CheckOutData {
  reservationId: string
  actualCheckOut: string
  roomCondition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  damageReport?: Array<{
    item: string
    description: string
    cost?: number
    photos?: string[]
  }>
  additionalCharges?: Array<{
    type: string
    description: string
    amount: number
  }>
  feedback?: {
    rating: number
    comment: string
  }
  keyCardsReturned: boolean
  notes?: string
}

// Reservation calendar event
export interface ReservationCalendarEvent {
  id: string
  title: string
  start: string
  end: string
  type: ReservationType
  status: ReservationStatus
  guestName: string
  accommodationName?: string
  activityName?: string
  totalAmount: number
  backgroundColor: string
  borderColor: string
  textColor: string
}

// Reservation statistics
export interface ReservationStats {
  period: {
    start: string
    end: string
  }
  metrics: {
    totalReservations: number
    confirmedReservations: number
    cancelledReservations: number
    noShowReservations: number
    totalRevenue: number
    averageStayLength: number
    averageAmount: number
    occupancyRate: number
    cancellationRate: number
    noShowRate: number
  }
  trends: Array<{
    date: string
    reservations: number
    revenue: number
    cancellations: number
  }>
  topAccommodations: Array<{
    accommodationId: string
    accommodationName: string
    reservations: number
    revenue: number
  }>
}

// Reservation conflicts
export interface ReservationConflict {
  accommodationId: string
  conflictType: 'OVERLAP' | 'MAINTENANCE' | 'BLOCKED'
  existingReservations: Array<{
    id: string
    checkIn: string
    checkOut: string
    guestName: string
  }>
  suggestedAlternatives?: Array<{
    accommodationId: string
    accommodationName: string
    price: number
  }>
}

// Bulk operations
export interface BulkReservationOperation {
  action: 'CONFIRM' | 'CANCEL' | 'UPDATE_STATUS' | 'SEND_REMINDER'
  reservationIds: string[]
  data?: {
    status?: ReservationStatus
    notes?: string
    emailTemplate?: string
  }
  reason?: string
}

// Reservation notifications
export interface ReservationNotification {
  type: 'CONFIRMATION' | 'REMINDER' | 'CHECK_IN' | 'CHECK_OUT' | 'CANCELLATION' | 'MODIFICATION'
  reservationId: string
  recipientEmail: string
  templateId: string
  variables: Record<string, any>
  scheduledAt?: string
  sentAt?: string
  status: 'PENDING' | 'SENT' | 'FAILED'
}

// Form validation interfaces
export interface ReservationFormData {
  accommodation?: {
    id: string
    name: string
    price: number
  }
  activity?: {
    id: string
    title: string
    price: number
  }
  dates: {
    checkIn: string
    checkOut: string
  }
  guests: {
    adults: number
    children: number
  }
  guestInfo: GuestInfo
  payment: {
    method: PaymentMethod
    installments?: number
  }
  preferences: {
    specialRequests?: string
    newsletter: boolean
    terms: boolean
  }
  coupon?: {
    code: string
    discount: number
  }
}

// Error types
export interface ReservationError {
  field?: keyof Reservation
  message: string
  code: string
}

// Event types for real-time updates
export interface ReservationEvent {
  type: 'CREATED' | 'UPDATED' | 'CANCELLED' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT'
  reservationId: string
  data?: Partial<Reservation>
  timestamp: string
}

// Constants
export const RESERVATION_STATUSES: Record<ReservationStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'yellow' },
  CONFIRMED: { label: 'Confirmada', color: 'green' },
  CHECKED_IN: { label: 'Check-in', color: 'blue' },
  CHECKED_OUT: { label: 'Check-out', color: 'gray' },
  CANCELLED: { label: 'Cancelada', color: 'red' },
  NO_SHOW: { label: 'Não Compareceu', color: 'orange' },
  EXPIRED: { label: 'Expirada', color: 'gray' },
}

export const PAYMENT_STATUSES: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'yellow' },
  PROCESSING: { label: 'Processando', color: 'blue' },
  PAID: { label: 'Pago', color: 'green' },
  PARTIALLY_PAID: { label: 'Parcialmente Pago', color: 'orange' },
  FAILED: { label: 'Falhou', color: 'red' },
  REFUNDED: { label: 'Reembolsado', color: 'purple' },
  REFUNDING: { label: 'Reembolsando', color: 'blue' },
}

export const PAYMENT_METHODS: Record<PaymentMethod, { label: string; icon: string }> = {
  CREDIT_CARD: { label: 'Cartão de Crédito', icon: 'credit-card' },
  DEBIT_CARD: { label: 'Cartão de Débito', icon: 'credit-card' },
  PIX: { label: 'PIX', icon: 'smartphone' },
  BANK_TRANSFER: { label: 'Transferência Bancária', icon: 'bank' },
  CASH: { label: 'Dinheiro', icon: 'banknote' },
  VOUCHER: { label: 'Voucher', icon: 'ticket' },
}