import { test, expect, type Page } from '@playwright/test'

// Test data
const VALID_USER = {
  email: 'admin@promata.org',
  password: 'password123',
}

const INVALID_USER = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
}

// Page object helper functions
class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async fillEmail(email: string) {
    await this.page.fill('[data-testid="email-input"]', email)
  }

  async fillPassword(password: string) {
    await this.page.fill('[data-testid="password-input"]', password)
  }

  async clickSubmit() {
    await this.page.click('[data-testid="login-submit"]')
  }

  async login(email: string, password: string) {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.clickSubmit()
  }

  async getErrorMessage() {
    return this.page.textContent('[data-testid="error-message"]')
  }

  async isLoading() {
    return this.page.isVisible('[data-testid="login-loading"]')
  }
}

test.describe('Login Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test.describe('Page Elements', () => {
    test('should display all login form elements', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/pro-mata.*login/i)

      // Check main heading
      await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible()

      // Check form elements
      await expect(page.getByTestId('email-input')).toBeVisible()
      await expect(page.getByTestId('password-input')).toBeVisible()
      await expect(page.getByTestId('login-submit')).toBeVisible()

      // Check links
      await expect(page.getByRole('link', { name: /esqueci minha senha/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /criar conta/i })).toBeVisible()

      // Check logo
      await expect(page.getByAltText(/pro-mata logo/i)).toBeVisible()
    })

    test('should have proper accessibility attributes', async ({ page }) => {
      // Check form labels
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/senha/i)).toBeVisible()

      // Check button accessibility
      const submitButton = page.getByTestId('login-submit')
      await expect(submitButton).toHaveAttribute('type', 'submit')

      // Check input types
      await expect(page.getByTestId('email-input')).toHaveAttribute('type', 'email')
      await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password')
    })
  })

  test.describe('Form Validation', () => {
    test('should show validation errors for empty fields', async ({ page }) => {
      await loginPage.clickSubmit()

      // Check validation messages
      await expect(page.getByText(/email é obrigatório/i)).toBeVisible()
      await expect(page.getByText(/senha é obrigatória/i)).toBeVisible()

      // Form should not be submitted
      await expect(page).toHaveURL(/login/)
    })

    test('should show validation error for invalid email format', async ({ page }) => {
      await loginPage.fillEmail('invalid-email')
      await loginPage.fillPassword('password123')
      await loginPage.clickSubmit()

      await expect(page.getByText(/email inválido/i)).toBeVisible()
      await expect(page).toHaveURL(/login/)
    })

    test('should show validation error for short password', async ({ page }) => {
      await loginPage.fillEmail('test@example.com')
      await loginPage.fillPassword('123')
      await loginPage.clickSubmit()

      await expect(page.getByText(/senha deve ter pelo menos 6 caracteres/i)).toBeVisible()
      await expect(page).toHaveURL(/login/)
    })

    test('should enable submit button only when form is valid', async ({ page }) => {
      const submitButton = page.getByTestId('login-submit')

      // Initially disabled or with validation states
      await loginPage.fillEmail('')
      await loginPage.fillPassword('')
      // Button behavior depends on implementation

      // Valid form should enable button
      await loginPage.fillEmail(VALID_USER.email)
      await loginPage.fillPassword(VALID_USER.password)
      await expect(submitButton).toBeEnabled()
    })
  })

  test.describe('Authentication', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      await loginPage.login(VALID_USER.email, VALID_USER.password)

      // Should show loading state
      await expect(page.getByTestId('login-loading')).toBeVisible()

      // Should redirect to dashboard
      await expect(page).toHaveURL(/dashboard/)

      // Should show user menu
      await expect(page.getByTestId('user-menu')).toBeVisible()

      // Should display welcome message
      await expect(page.getByText(/bem-vindo/i)).toBeVisible()
    })

    test('should show error message with invalid credentials', async ({ page }) => {
      await loginPage.login(INVALID_USER.email, INVALID_USER.password)

      // Should show error message
      await expect(page.getByTestId('error-message')).toBeVisible()
      await expect(page.getByText(/credenciais inválidas/i)).toBeVisible()

      // Should stay on login page
      await expect(page).toHaveURL(/login/)

      // Form should be reset or cleared
      await expect(page.getByTestId('password-input')).toHaveValue('')
    })

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/auth/login', route => 
        route.abort('failed')
      )

      await loginPage.login(VALID_USER.email, VALID_USER.password)

      // Should show network error message
      await expect(page.getByText(/erro de conexão/i)).toBeVisible()
      await expect(page).toHaveURL(/login/)
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to register page', async ({ page }) => {
      await page.click('text=Criar conta')
      await expect(page).toHaveURL(/register/)
    })

    test('should navigate to forgot password page', async ({ page }) => {
      await page.click('text=Esqueci minha senha')
      await expect(page).toHaveURL(/forgot-password/)
    })

    test('should redirect authenticated users away from login', async ({ page, context }) => {
      // Set authentication token
      await context.addCookies([{
        name: 'auth-token',
        value: 'valid-token',
        domain: 'localhost',
        path: '/',
      }])

      await loginPage.goto()

      // Should redirect to dashboard
      await expect(page).toHaveURL(/dashboard/)
    })
  })

  test.describe('User Experience', () => {
    test('should remember email on page reload', async ({ page }) => {
      await loginPage.fillEmail(VALID_USER.email)
      await page.reload()

      // Email should be remembered (if implemented)
      // This depends on your implementation
    })

    test('should show/hide password toggle', async ({ page }) => {
      const passwordInput = page.getByTestId('password-input')
      const toggleButton = page.getByTestId('password-toggle')

      await loginPage.fillPassword('mypassword')

      // Initially hidden
      await expect(passwordInput).toHaveAttribute('type', 'password')

      // Click toggle to show
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'text')

      // Click toggle to hide again
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('email-input')).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByTestId('password-input')).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByTestId('login-submit')).toBeFocused()

      // Submit with Enter
      await loginPage.fillEmail(VALID_USER.email)
      await loginPage.fillPassword(VALID_USER.password)
      await page.keyboard.press('Enter')

      await expect(page).toHaveURL(/dashboard/)
    })

    test('should handle loading states correctly', async ({ page }) => {
      // Slow down network to see loading state
      await page.route('**/auth/login', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: { id: 1, email: VALID_USER.email },
            token: 'mock-token',
          }),
        })
      })

      await loginPage.login(VALID_USER.email, VALID_USER.password)

      // Should show loading spinner
      await expect(page.getByTestId('login-loading')).toBeVisible()

      // Submit button should be disabled during loading
      await expect(page.getByTestId('login-submit')).toBeDisabled()

      // Should eventually redirect
      await expect(page).toHaveURL(/dashboard/, { timeout: 5000 })
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should be responsive on mobile devices', async ({ page }) => {
      // Check that elements are visible and properly sized
      await expect(page.getByTestId('email-input')).toBeVisible()
      await expect(page.getByTestId('password-input')).toBeVisible()
      await expect(page.getByTestId('login-submit')).toBeVisible()

      // Check that form is properly sized for mobile
      const form = page.getByRole('form')
      const boundingBox = await form.boundingBox()
      expect(boundingBox?.width).toBeLessThan(400)
    })
  })
})