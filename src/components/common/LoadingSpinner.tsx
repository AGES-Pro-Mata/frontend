import { cn } from '@/utils'
import { Leaf, Loader2 } from 'lucide-react'
import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'nature'
  text?: string
  className?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  text, 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const spinnerContent = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner size={size} />
      case 'pulse':
        return <PulseSpinner size={size} />
      case 'nature':
        return <NatureSpinner size={size} />
      default:
        return (
          <Loader2 
            className={cn(
              'animate-spin text-primary',
              sizeClasses[size]
            )} 
          />
        )
    }
  }

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-2',
      className
    )}>
      {spinnerContent()}
      {text && (
        <p className={cn(
          'text-muted-foreground font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

// Dots spinner variant
function DotsSpinner({ size }: { size: LoadingSpinnerProps['size'] }) {
  const dotSize = {
    sm: 'h-1 w-1',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
    xl: 'h-3 w-3',
  }[size || 'md']

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'bg-primary rounded-full animate-pulse',
            dotSize
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  )
}

// Pulse spinner variant
function PulseSpinner({ size }: { size: LoadingSpinnerProps['size'] }) {
  return (
    <div className={cn(
      'relative',
      sizeClasses[size || 'md']
    )}>
      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
      <div className="relative bg-primary rounded-full h-full w-full" />
    </div>
  )
}

// Nature-themed spinner (Pro-Mata specific)
function NatureSpinner({ size }: { size: LoadingSpinnerProps['size'] }) {
  return (
    <div className="relative">
      <Leaf 
        className={cn(
          'animate-spin text-pro-mata-green-600',
          sizeClasses[size || 'md']
        )}
        style={{
          animationDuration: '2s',
        }}
      />
    </div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
  blur?: boolean
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = 'Carregando...',
  blur = true 
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className={cn(
          'absolute inset-0 z-10 flex items-center justify-center bg-background/80',
          blur && 'backdrop-blur-sm'
        )}>
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  )
}

// Loading button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({ 
  isLoading = false, 
  loadingText = 'Carregando...', 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'h-10 px-4 py-2',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

// Skeleton loading components
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )} 
    />
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// List skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Image skeleton
export function ImageSkeleton({ aspectRatio = 'aspect-video' }: { aspectRatio?: string }) {
  return (
    <Skeleton className={cn('w-full', aspectRatio)} />
  )
}

// Avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size]

  return <Skeleton className={cn('rounded-full', sizeClass)} />
}

export default LoadingSpinner