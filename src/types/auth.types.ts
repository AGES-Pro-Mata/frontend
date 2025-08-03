// Base user types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  
  // User classification
  userType: UserType
  role: UserRole
  permissions?: Permission[]
  
  // Personal information
  document?: string
  documentType?: DocumentType
  birthDate?: string
  nationality?: string
  gender?: Gender
  
  // Address information
  address?: Address
  
  // Preferences and settings
  preferences: UserPreferences
  
  // Account status
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  profileComplete: boolean
  
  // Institutional information (for PUCRS users)
  institutionalInfo?: InstitutionalInfo
  
  // Dates
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
}

export type UserType = 
  | 'PUCRS_STUDENT'          // Aluno da PUCRS
  | 'PUCRS_FACULTY'          // Professor da PUCRS  
  | 'PUCRS_STAFF'            // Funcionário da PUCRS
  | 'OTHER_UNIVERSITY'       // Aluno/Professor de outra universidade
  | 'GENERAL_PUBLIC'         // Público geral
  | 'RESEARCHER'             // Pesquisador
  | 'CORPORATE'              // Corporativo

export type UserRole = 
  | 'SUPER_ADMIN'           // Administrador geral
  | 'ADMIN'                 // Administrador
  | 'STAFF'                 // Funcionário
  | 'MODERATOR'             // Moderador
  | 'USER'                  // Usuário comum

export type Permission = 
  | 'MANAGE_USERS'
  | 'MANAGE_ACCOMMODATIONS'
  | 'MANAGE_RESERVATIONS'
  | 'MANAGE_ACTIVITIES'
  | 'VIEW_REPORTS'
  | 'MANAGE_CONTENT'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_PAYMENTS'
  | 'VIEW_ANALYTICS'
  | 'MODERATE_REVIEWS'

export type UserStatus = 
  | 'ACTIVE'                // Ativo
  | 'INACTIVE'              // Inativo
  | 'SUSPENDED'             // Suspenso
  | 'PENDING_VERIFICATION'  // Aguardando verificação
  | 'DELETED'               // Deletado

export type DocumentType = 'CPF' | 'RG' | 'PASSPORT' | 'CNH'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

export interface Address {
  street: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface UserPreferences {
  language: 'pt-BR' | 'en-US' | 'es-ES'
  timezone: string
  currency: 'BRL' | 'USD' | 'EUR'
  
  // Notification preferences
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    
    // Specific notification types
    reservationUpdates: boolean
    promotions: boolean
    newsletter: boolean
    reminders: boolean
    announcements: boolean
  }
  
  // Privacy preferences
  privacy: {
    profileVisible: boolean
    showEmail: boolean
    showPhone: boolean
    allowDataProcessing: boolean
    allowMarketing: boolean
  }
  
  // UI preferences
  ui: {
    theme: 'light' | 'dark' | 'auto'
    density: 'comfortable' | 'compact'
    animations: boolean
  }
}

export interface InstitutionalInfo {
  institution: string
  studentId?: string
  employeeId?: string
  department?: string
  course?: string
  semester?: number
  graduationYear?: number
  advisorName?: string
  advisorEmail?: string
  researchArea?: string
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  userType: UserType
  document?: string
  documentType?: DocumentType
  birthDate?: string
  
  // Institutional info (if applicable)
  institutionalInfo?: Partial<InstitutionalInfo>
  
  // Required agreements
  acceptTerms: boolean
  acceptPrivacy: boolean
  acceptNewsletter?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
  permissions: Permission[]
}

// Profile update types
export interface UpdateProfileDTO {
  name?: string
  phone?: string
  avatar?: File | string
  document?: string
  documentType?: DocumentType
  birthDate?: string
  nationality?: string
  gender?: Gender
  address?: Address
  institutionalInfo?: Partial<InstitutionalInfo>
  preferences?: Partial<UserPreferences>
}

export interface ChangePasswordDTO {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ForgotPasswordDTO {
  email: string
}

export interface ResetPasswordDTO {
  token: string
  newPassword: string
  confirmNewPassword: string
}

// Email verification
export interface EmailVerificationDTO {
  token: string
}

export interface ResendVerificationDTO {
  email: string
}

// Phone verification
export interface PhoneVerificationDTO {
  phone: string
  code: string
}

export interface RequestPhoneVerificationDTO {
  phone: string
}

// Two-factor authentication
export interface TwoFactorSetupDTO {
  secret: string
  code: string
}

export interface TwoFactorVerifyDTO {
  code: string
}

export interface TwoFactorBackupCodes {
  codes: string[]
}

// User management (admin)
export interface CreateUserDTO {
  name: string
  email: string
  password: string
  userType: UserType
  role: UserRole
  permissions?: Permission[]
  phone?: string
  document?: string
  documentType?: DocumentType
  institutionalInfo?: Partial<InstitutionalInfo>
  sendWelcomeEmail?: boolean
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  userType?: UserType
  role?: UserRole
  permissions?: Permission[]
  status?: UserStatus
  phone?: string
  document?: string
  documentType?: DocumentType
  institutionalInfo?: Partial<InstitutionalInfo>
}

// User filters for admin panel
export interface UserFilters {
  search?: string
  userType?: UserType[]
  role?: UserRole[]
  status?: UserStatus[]
  emailVerified?: boolean
  phoneVerified?: boolean
  createdFrom?: string
  createdTo?: string
  lastLoginFrom?: string
  lastLoginTo?: string
  institution?: string
}

// User statistics
export interface UserStats {
  period: {
    start: string
    end: string
  }
  metrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    verifiedUsers: number
    suspendedUsers: number
    deletedUsers: number
    
    // By user type
    byUserType: Record<UserType, number>
    byRole: Record<UserRole, number>
    
    // Activity metrics
    loginFrequency: number
    averageSessionDuration: number
    reservationsPerUser: number
  }
  trends: Array<{
    date: string
    newUsers: number
    activeUsers: number
    logins: number
  }>
}

// Session management
export interface UserSession {
  id: string
  userId: string
  deviceInfo: {
    userAgent: string
    ip: string
    location?: string
    device: string
    browser: string
    os: string
  }
  createdAt: string
  lastActivity: string
  expiresAt: string
  isActive: boolean
}

// Activity log
export interface UserActivity {
  id: string
  userId: string
  action: string
  resource?: string
  resourceId?: string
  details?: Record<string, any>
  ip: string
  userAgent: string
  createdAt: string
}

// Bulk operations
export interface BulkUserOperation {
  action: 'ACTIVATE' | 'DEACTIVATE' | 'SUSPEND' | 'DELETE' | 'UPDATE_ROLE' | 'SEND_EMAIL'
  userIds: string[]
  data?: {
    role?: UserRole
    status?: UserStatus
    emailTemplate?: string
  }
  reason?: string
}

// User export/import
export interface UserExportData {
  format: 'CSV' | 'XLSX' | 'JSON'
  fields: (keyof User)[]
  filters?: UserFilters
}

export interface UserImportResult {
  imported: number
  updated: number
  errors: Array<{
    row: number
    email: string
    error: string
  }>
}

// Form validation types
export interface UserFormData {
  personal: {
    name: string
    email: string
    phone?: string
    document?: string
    documentType?: DocumentType
    birthDate?: string
    nationality?: string
    gender?: Gender
  }
  address?: Address
  institutional?: InstitutionalInfo
  preferences: UserPreferences
  security: {
    password?: string
    confirmPassword?: string
    twoFactorEnabled?: boolean
  }
}

// Error types
export interface AuthError {
  field?: string
  message: string
  code: string
}

// Constants
export const USER_TYPES: Record<UserType, { label: string; description: string }> = {
  PUCRS_STUDENT: { 
    label: 'Aluno PUCRS', 
    description: 'Estudante da Pontifícia Universidade Católica do Rio Grande do Sul' 
  },
  PUCRS_FACULTY: { 
    label: 'Professor PUCRS', 
    description: 'Professor da Pontifícia Universidade Católica do Rio Grande do Sul' 
  },
  PUCRS_STAFF: { 
    label: 'Funcionário PUCRS', 
    description: 'Funcionário da Pontifícia Universidade Católica do Rio Grande do Sul' 
  },
  OTHER_UNIVERSITY: { 
    label: 'Outra Universidade', 
    description: 'Estudante ou professor de outra instituição de ensino' 
  },
  GENERAL_PUBLIC: { 
    label: 'Público Geral', 
    description: 'Visitante do público em geral' 
  },
  RESEARCHER: { 
    label: 'Pesquisador', 
    description: 'Pesquisador independente ou de outra instituição' 
  },
  CORPORATE: { 
    label: 'Corporativo', 
    description: 'Representante de empresa ou organização' 
  },
}

export const USER_ROLES: Record<UserRole, { label: string; level: number }> = {
  SUPER_ADMIN: { label: 'Super Administrador', level: 100 },
  ADMIN: { label: 'Administrador', level: 80 },
  STAFF: { label: 'Funcionário', level: 60 },
  MODERATOR: { label: 'Moderador', level: 40 },
  USER: { label: 'Usuário', level: 10 },
}

export const USER_STATUSES: Record<UserStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Ativo', color: 'green' },
  INACTIVE: { label: 'Inativo', color: 'gray' },
  SUSPENDED: { label: 'Suspenso', color: 'red' },
  PENDING_VERIFICATION: { label: 'Aguardando Verificação', color: 'yellow' },
  DELETED: { label: 'Deletado', color: 'red' },
}

export const PERMISSIONS: Record<Permission, { label: string; description: string }> = {
  MANAGE_USERS: { 
    label: 'Gerenciar Usuários', 
    description: 'Criar, editar e excluir usuários' 
  },
  MANAGE_ACCOMMODATIONS: { 
    label: 'Gerenciar Acomodações', 
    description: 'Criar, editar e excluir acomodações' 
  },
  MANAGE_RESERVATIONS: { 
    label: 'Gerenciar Reservas', 
    description: 'Visualizar e gerenciar reservas de todos os usuários' 
  },
  MANAGE_ACTIVITIES: { 
    label: 'Gerenciar Atividades', 
    description: 'Criar, editar e excluir atividades' 
  },
  VIEW_REPORTS: { 
    label: 'Visualizar Relatórios', 
    description: 'Acessar relatórios e estatísticas' 
  },
  MANAGE_CONTENT: { 
    label: 'Gerenciar Conteúdo', 
    description: 'Editar conteúdo do site e páginas' 
  },
  MANAGE_SETTINGS: { 
    label: 'Gerenciar Configurações', 
    description: 'Alterar configurações do sistema' 
  },
  MANAGE_PAYMENTS: { 
    label: 'Gerenciar Pagamentos', 
    description: 'Visualizar e gerenciar informações de pagamento' 
  },
  VIEW_ANALYTICS: { 
    label: 'Visualizar Analytics', 
    description: 'Acessar dados de analytics e métricas' 
  },
  MODERATE_REVIEWS: { 
    label: 'Moderar Avaliações', 
    description: 'Moderar e gerenciar avaliações de usuários' 
  },
}