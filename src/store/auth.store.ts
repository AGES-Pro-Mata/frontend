import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { toast } from 'react-hot-toast'

import { authService } from '@/services/auth.service'
import type { LoginCredentials, Permission, RegisterData, User } from '@/types/auth.types'

// Types
export interface AuthState {
  // State
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  loginAttempts: number
  lastLoginAttempt: number | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: (showToast?: boolean) => void
  refreshAuth: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  clearError: () => void
  clearLoginAttempts: () => void

  // Getters
  hasRole: (role: string) => boolean
  hasPermission: (permission: Permission) => boolean
  isTokenExpired: () => boolean
  getTimeUntilExpiry: () => number | null
}

// Constants
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

// Helper functions
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number}
    const currentTime = Date.now() / 1000

    return payload.exp < currentTime
  } catch {
    return true
  }
}

const getTokenExpiry = (token: string | null): number | null => {
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number }

    return payload.exp * 1000 // Convert to milliseconds
  } catch {
    return null
  }
}

const shouldRefreshToken = (token: string | null): boolean => {
  const expiry = getTokenExpiry(token)

  if (!expiry) return false
  
  const timeUntilExpiry = expiry - Date.now()

  return timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD
}

// Create the store
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lastLoginAttempt: null,

        // Actions
        login: async (credentials: LoginCredentials) => {
          const state = get()
          
          // Check if user is rate limited
          if (
            state.loginAttempts >= MAX_LOGIN_ATTEMPTS &&
            state.lastLoginAttempt &&
            Date.now() - state.lastLoginAttempt < LOGIN_ATTEMPT_WINDOW
          ) {
            const timeLeft = Math.ceil((LOGIN_ATTEMPT_WINDOW - (Date.now() - state.lastLoginAttempt)) / 60000)

            set((state) => {
              state.error = `Muitas tentativas de login. Tente novamente em ${timeLeft} minutos.`
            })

            return
          }

          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const response: { user: User; token: string; refreshToken?: string } = await authService.login(credentials)
            
            set((state) => {
              state.user = response.user
              state.token = response.token
              state.refreshToken = response.refreshToken ?? null
              state.isAuthenticated = true
              state.isLoading = false
              state.error = null
              state.loginAttempts = 0
              state.lastLoginAttempt = null
            })

            toast.success(`Bem-vindo, ${response.user.name}!`)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login'
            
            set((state) => {
              state.isLoading = false
              state.error = errorMessage
              state.loginAttempts += 1
              state.lastLoginAttempt = Date.now()
            })

            toast.error(errorMessage)
            throw error
          }
        },

        register: async (data: RegisterData) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const response: { user: User; token: string; refreshToken?: string } = await authService.register(data)
            
            set((state) => {
              state.user = response.user
              state.token = response.token
              state.refreshToken = response.refreshToken ?? null
              state.isAuthenticated = true
              state.isLoading = false
              state.error = null
            })

            toast.success('Conta criada com sucesso! Bem-vindo ao Pro-Mata!')
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta'
            
            set((state) => {
              state.isLoading = false
              state.error = errorMessage
            })

            toast.error(errorMessage)
            throw error
          }
        },

        logout: (showToast = true) => {
          try {
            // Call logout API if user is authenticated
            const { token } = get()

            if (token && !isTokenExpired(token)) {
              authService.logout().catch(console.error)
            }
          } catch (error) {
            console.error('Error during logout:', error)
          }

          set((state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null
            state.loginAttempts = 0
            state.lastLoginAttempt = null
          })

          if (showToast) {
            toast.success('Logout realizado com sucesso!')
          }
        },

        refreshAuth: async () => {
          const state = get()
          
          if (!state.refreshToken) {
            get().logout(false)

            return
          }

          try {
            const response: { user: User; token: string; refreshToken?: string } = await authService.refreshToken()
            
            set((state) => {
              state.token = response.token
              state.refreshToken = response.refreshToken ?? null
              state.user = response.user
              state.isAuthenticated = true
              state.error = null
            })
          } catch (error) {
            console.error('Token refresh failed:', error)
            get().logout(false)
            throw error
          }
        },

        updateProfile: async (data: Partial<User>) => {
          const state = get()

          if (!state.user) throw new Error('Usuário não autenticado')

          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            // TODO: implement authService.updateProfile(data)
            const updatedUser = { ...state.user, ...data }
            
            set((state) => {
              state.user = updatedUser
              state.isLoading = false
            })

            toast.success('Perfil atualizado com sucesso!')
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
            
            set((state) => {
              state.isLoading = false
              state.error = errorMessage
            })

            toast.error(errorMessage)
            throw error
          }
        },

        changePassword: async (currentPassword: string, newPassword: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await authService.changePassword(currentPassword, newPassword)
            
            set((state) => {
              state.isLoading = false
            })

            toast.success('Senha alterada com sucesso!')
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha'
            
            set((state) => {
              state.isLoading = false
              state.error = errorMessage
            })

            toast.error(errorMessage)
            throw error
          }
        },

        forgotPassword: async (email: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            //await authService.forgotPassword(email) // TODO: implement
            
            set((state) => {
              state.isLoading = false
            })

            toast.success('Email de recuperação enviado!')
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email'
            
            set((state) => {
              state.isLoading = false
              state.error = errorMessage
            })

            toast.error(errorMessage)
            throw error
          }
        },

        resetPassword: async (token: string, newPassword: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await authService.resetPassword(token, newPassword)
            
            set((state) => {
              state.isLoading = false
            })

            toast.success('Senha redefinida com sucesso!')
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao redefinir senha'
            
            set((state) => {
              state.isLoading = false
              state.error = errorMessage
            })

            toast.error(errorMessage)
            throw error
          }
        },

        clearError: () => {
          set((state) => {
            state.error = null
          })
        },

        clearLoginAttempts: () => {
          set((state) => {
            state.loginAttempts = 0
            state.lastLoginAttempt = null
          })
        },

        // Getters
        hasRole: (role: string) => {
          const { user } = get()

          return user?.role === role
        },

        hasPermission: (permission: Permission) => {
          const { user } = get()

          return user?.permissions?.includes(permission) || false
        },

        isTokenExpired: () => {
          const { token } = get()

          return isTokenExpired(token)
        },

        getTimeUntilExpiry: () => {
          const { token } = get()
          const expiry = getTokenExpiry(token)

          return expiry ? expiry - Date.now() : null
        },
      })),
      {
        name: 'pro-mata-auth',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)

// Selectors for performance optimization
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  updateProfile: state.updateProfile,
  changePassword: state.changePassword,
  forgotPassword: state.forgotPassword,
  resetPassword: state.resetPassword,
  clearError: state.clearError,
}))

// Auto token refresh setup
let refreshTimer: ReturnType<typeof setTimeout> | null = null

const setupTokenRefresh = () => {
  const state = useAuthStore.getState()
  
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  if (!state.token || !state.isAuthenticated) return

  const timeUntilExpiry = state.getTimeUntilExpiry()

  if (!timeUntilExpiry || timeUntilExpiry <= 0) {
    state.logout(false)

    return
  }

  // Set refresh timer for 5 minutes before expiry
  const refreshIn = Math.max(0, timeUntilExpiry - TOKEN_REFRESH_THRESHOLD)
  
  refreshTimer = setTimeout(() => {
    state
      .refreshAuth()
      .then(() => {
        setupTokenRefresh() // Setup next refresh
      })
      .catch(() => {
        // Optionally handle error (e.g., logout or silent fail)
      })
  }, refreshIn)
}

// Subscribe to auth state changes
useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      setupTokenRefresh()
    } else if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }
)

// Initialize token refresh on app start
const initialState = useAuthStore.getState()

if (initialState.isAuthenticated && initialState.token) {
  if (isTokenExpired(initialState.token)) {
    initialState.logout(false)
  } else if (shouldRefreshToken(initialState.token)) {
    initialState.refreshAuth().catch(() => {
      initialState.logout(false)
    })
  } else {
    setupTokenRefresh()
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }
  })
}

export default useAuthStore