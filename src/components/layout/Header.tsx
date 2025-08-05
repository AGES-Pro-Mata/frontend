import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Search,
  Home,
  Building,
  Calendar,
  Phone
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { useAuthStore } from '@/store/auth.store'
import { stringUtils } from '@/utils'

const NAVIGATION_ITEMS = [
  {
    label: 'Início',
    href: '/',
    icon: Home,
  },
  {
    label: 'Acomodações',
    href: '/accommodations',
    icon: Building,
  },
  {
    label: 'Atividades',
    href: '/activities',
    icon: Calendar,
  },
  {
    label: 'Contato',
    href: '/contact',
    icon: Phone,
  },
]

export function Header() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  // Mobile navigation component
  const MobileNavigation = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-3">
            <img
              src="/icons/icon-96x96.png"
              alt="Pro-Mata"
              className="h-10 w-10 rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/images/pro-mata-logo.png"
              }}
            />
            <div className="text-left">
              <span className="text-lg font-bold text-primary">Pro-Mata</span>
              <p className="text-xs text-muted-foreground font-normal">
                Centro de Pesquisas
              </p>
            </div>
          </SheetTitle>
          <SheetDescription>
            Sistema de reservas e hospedagem em uma das mais importantes reservas ambientais do Brasil
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col space-y-4 mt-8">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {isAuthenticated && (
            <>
              <div className="border-t pt-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Perfil</span>
                </Link>
              </div>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="justify-start px-3 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </Button>
            </>
          )}

          {!isAuthenticated && (
            <div className="border-t pt-4 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  Criar Conta
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )

  // User menu component
  const UserMenu = () => {
    if (!isAuthenticated || !user) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
            <Avatar className="h-10 w-10 border-2 border-background shadow-md">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {stringUtils.getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {stringUtils.getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <Badge variant="secondary" className="text-xs w-fit">
                  {user.userType || 'Usuário'}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <Link to="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-3 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          
          <Link to="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-3 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <MobileNavigation />
            
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
              <div className="relative">
                <img
                  src="/icons/icon-128x128.png"
                  alt="Pro-Mata - Centro de Pesquisas"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                  onError={(e) => {
                    e.currentTarget.src = "/images/pro-mata-logo.png"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl text-primary leading-tight">
                  Pro-Mata
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">
                  Centro de Pesquisas
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary hover:scale-105 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar acomodações, atividades..."
                className="pl-9 pr-4 bg-muted/50 border-muted focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search button (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-accent"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-accent"
                  aria-label="Notificações"
                >
                  <Bell className="h-5 w-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <UserMenu />
              </>
            ) : (
              /* Auth buttons */
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-accent">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}