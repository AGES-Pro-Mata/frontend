import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button Component', () => {
  const user = userEvent.setup()

  it('should render correctly with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
    expect(button).not.toBeDisabled()
  })

  it('should render with custom variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button', { name: /secondary button/i })

    expect(button).toHaveClass('bg-secondary')
  })

  it('should render with custom size', () => {
    render(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button', { name: /large button/i })

    expect(button).toHaveClass('px-8', 'py-3')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })

    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('should show loading state', () => {
    render(<Button loading>Loading Button</Button>)
    
    const button = screen.getByRole('button', { name: /loading button/i })

    expect(button).toBeDisabled()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Clickable Button</Button>)
    
    const button = screen.getByRole('button', { name: /clickable button/i })

    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not handle click events when disabled', async () => {
    const handleClick = vi.fn()

    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /disabled button/i })

    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should not handle click events when loading', async () => {
    const handleClick = vi.fn()

    render(
      <Button loading onClick={handleClick}>
        Loading Button
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /loading button/i })

    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>

    render(
      <Button icon={<TestIcon />}>
        Button with Icon
      </Button>
    )
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /button with icon/i })).toBeInTheDocument()
  })

  it('should render as icon-only button', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>

    render(
      <Button icon={<TestIcon />} aria-label="Icon button" />
    )
    
    const button = screen.getByRole('button', { name: /icon button/i })

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('aspect-square')
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should render as different HTML element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: /link button/i })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('bg-primary') // Should still have button styles
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button', { name: /custom button/i })

    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-primary') // Should merge with default classes
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()

    render(<Button ref={ref}>Ref Button</Button>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('should handle keyboard events', async () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Keyboard Button</Button>)
    
    const button = screen.getByRole('button', { name: /keyboard button/i })

    button.focus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('should have proper accessibility attributes', () => {
    render(
      <Button 
        aria-label="Accessible button"
        aria-describedby="button-description"
      >
        Accessible Button
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /accessible button/i })

    expect(button).toHaveAttribute('aria-label', 'Accessible button')
    expect(button).toHaveAttribute('aria-describedby', 'button-description')
  })

  describe('Button Variants', () => {
    const variants = [
      { variant: 'default', expectedClass: 'bg-primary' },
      { variant: 'secondary', expectedClass: 'bg-secondary' },
      { variant: 'destructive', expectedClass: 'bg-destructive' },
      { variant: 'outline', expectedClass: 'border-input' },
      { variant: 'ghost', expectedClass: 'hover:bg-accent' },
      { variant: 'link', expectedClass: 'text-primary' },
    ] as const

    variants.forEach(({ variant, expectedClass }) => {
      it(`should render ${variant} variant correctly`, () => {
        render(<Button variant={variant}>{variant} Button</Button>)
        
        const button = screen.getByRole('button')

        expect(button).toHaveClass(expectedClass)
      })
    })
  })

  describe('Button Sizes', () => {
    const sizes = [
      { size: 'sm', expectedClasses: ['px-3', 'py-1.5'] },
      { size: 'default', expectedClasses: ['px-4', 'py-2'] },
      { size: 'lg', expectedClasses: ['px-8', 'py-3'] },
      { size: 'icon', expectedClasses: ['h-10', 'w-10'] },
    ] as const

    sizes.forEach(({ size, expectedClasses }) => {
      it(`should render ${size} size correctly`, () => {
        render(<Button size={size}>{size} Button</Button>)
        
        const button = screen.getByRole('button')
        
        expectedClasses.forEach(className => {
          expect(button).toHaveClass(className)
        })
      })
    })
  })
})