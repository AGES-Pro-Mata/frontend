import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-pro-mata-green-constrast text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Pro-Mata specific variants
        nature: 'bg-pro-mata-green-contrast text-white hover:bg-pro-mata-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
        earth: 'bg-pro-mata-brown-600 text-white hover:bg-pro-mata-brown-700 shadow-md hover:shadow-lg',
        sky: 'bg-pro-mata-blue-500 text-white hover:bg-pro-mata-blue-600 shadow-md hover:shadow-lg',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'nature',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    
    // Determine if this is an icon-only button
    const isIconOnly = !children && icon
    const actualSize = isIconOnly && size === 'default' ? 'icon' : size
    
    // Loading state overrides disabled
    const isDisabled = disabled || loading
    
    const buttonContent = (
      <>
        {loading && (
          <Loader2 
            className="animate-spin" 
            data-testid="loading-spinner"
            aria-hidden="true"
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        
        {children && (
          <span className={cn(loading && 'opacity-70')}>
            {children}
          </span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </>
    )

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size: actualSize, className }),
          fullWidth && 'w-full',
          isIconOnly && 'aspect-square',
          loading && 'cursor-wait'
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-loading={loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }

// Compound component for button groups
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  size?: VariantProps<typeof buttonVariants>['size']
  variant?: VariantProps<typeof buttonVariants>['variant']
  attached?: boolean
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    { 
      className, 
      orientation = 'horizontal', 
      size, 
      variant, 
      attached = false,
      children,
      ...props 
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children)
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          attached && orientation === 'horizontal' && '[&>*:not(:first-child)]:ml-[-1px] [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none',
          attached && orientation === 'vertical' && '[&>*:not(:first-child)]:mt-[-1px] [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none',
          !attached && (orientation === 'horizontal' ? 'gap-2' : 'gap-1'),
          className
        )}
        role="group"
        {...props}
      >
        {React.Children.map(childrenArray, (child) => {
          if (React.isValidElement(child) && child.type === Button) {
            return React.cloneElement(child as React.ReactElement<ButtonProps>, {
              size: (child as React.ReactElement<ButtonProps>).props.size || size,
              variant: (child as React.ReactElement<ButtonProps>).props.variant || variant,
              ...(attached && {
                className: cn(
                  (child as React.ReactElement<ButtonProps>).props.className,
                  'relative z-0 focus:z-10'
                )
              })
            })
          }

          return child
        })}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }

// Utility hooks for button interactions
export const useButtonState = (
  initialLoading = false
): [boolean, () => void, () => void, (value: boolean) => void] => {
  const [loading, setLoading] = React.useState(initialLoading)
  
  const startLoading = React.useCallback(() => setLoading(true), [])
  const stopLoading = React.useCallback(() => setLoading(false), [])
  
  return [loading, startLoading, stopLoading, setLoading]
}

// Button with automatic loading state management
interface AsyncButtonProps extends Omit<ButtonProps, 'loading' | 'onClick' | 'onError'> {
  onClick?: () => Promise<void> | void
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ onClick, onSuccess, onError, ...props }, ref) => {
    const [loading, startLoading, stopLoading] = useButtonState()
    
    const handleClick = React.useCallback(async () => {
      if (!onClick || loading) return
      
      try {
        startLoading()
        await onClick()
        onSuccess?.()
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error('Unknown error'))
      } finally {
        stopLoading()
      }
    }, [onClick, loading, startLoading, stopLoading, onSuccess, onError])
    
    return (
      <Button
        ref={ref}
        loading={loading}
        onClick={() => { void handleClick(); }}
        {...props}
      />
    )
  }
)

AsyncButton.displayName = 'AsyncButton'