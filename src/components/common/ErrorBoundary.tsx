import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children?: ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export interface ErrorFallbackProps {
  error: Error
  errorInfo?: ErrorInfo
  reset: () => void
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Send error to monitoring service in production
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo)
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Example: Send to error tracking service
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //   },
    // })

    console.log('Error reported to monitoring service:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public override render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props
      const { error, errorInfo } = this.state

      if (FallbackComponent && error) {
        return (
          <FallbackComponent 
            error={error} 
            errorInfo={errorInfo || undefined}
            reset={this.handleReset} 
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={error!}
          errorInfo={errorInfo || undefined}
          reset={this.handleReset}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps extends ErrorFallbackProps {
  onReload: () => void
  onGoHome: () => void
}

function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  reset, 
  onReload, 
  onGoHome 
}: DefaultErrorFallbackProps) {
  const isDev = import.meta.env.DEV

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">
            Oops! Algo deu errado
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Encontramos um erro inesperado. Nossa equipe foi notificada e está 
            trabalhando para resolver o problema.
          </p>

          {isDev && error && (
            <details className="rounded-lg border bg-muted/50 p-4">
              <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Detalhes do erro (desenvolvimento)
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <strong className="text-sm">Mensagem:</strong>
                  <pre className="mt-1 text-xs text-destructive bg-background p-2 rounded border overflow-auto">
                    {error.message}
                  </pre>
                </div>
                
                {error.stack && (
                  <div>
                    <strong className="text-sm">Stack Trace:</strong>
                    <pre className="mt-1 text-xs text-muted-foreground bg-background p-2 rounded border overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}
                
                {errorInfo?.componentStack && (
                  <div>
                    <strong className="text-sm">Component Stack:</strong>
                    <pre className="mt-1 text-xs text-muted-foreground bg-background p-2 rounded border overflow-auto max-h-32">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">O que você pode fazer:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tente recarregar a página</li>
              <li>• Verifique sua conexão com a internet</li>
              <li>• Volte à página inicial</li>
              <li>• Entre em contato se o problema persistir</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button onClick={reset} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button onClick={onReload} variant="outline" className="flex-1">
              Recarregar Página
            </Button>
          </div>
          
          <Button onClick={onGoHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-2">
            Se o problema persistir, entre em contato pelo email: 
            <a 
              href="mailto:promata@pucrs.br" 
              className="text-primary hover:underline ml-1"
            >
              promata@pucrs.br
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // You can also trigger error reporting here
    if (import.meta.env.PROD) {
      // Report to error tracking service
    }
  }
}

// HOC for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={errorFallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}