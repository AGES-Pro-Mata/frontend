import { Link, useLocation } from '@tanstack/react-router'
import { 
  BarChart3,
  BookOpen,
  Building,
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Users
} from 'lucide-react'
import React, { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'

import type { Permission } from '@/types/auth.types'

interface SidebarItem {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: SidebarItem[]
  roles?: string[]
  permissions?: Permission[]
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Minhas Reservas',
    href: '/dashboard/reservations',
    icon: Calendar,
  },
  {
    label: 'Perfil',
    href: '/dashboard/profile',
    icon: Users,
  },
  {
    label: 'Acomodações',
    icon: Building,
    children: [
      {
        label: 'Buscar',
        href: '/accommodations',
        icon: Building,
      },
      {
        label: 'Favoritas',
        href: '/dashboard/favorites',
        icon: Building,
      },
    ],
  },
  {
    label: 'Atividades',
    icon: BookOpen,
    children: [
      {
        label: 'Trilhas',
        href: '/activities?type=trail',
        icon: BookOpen,
      },
      {
        label: 'Workshops',
        href: '/activities?type=workshop',
        icon: BookOpen,
      },
      {
        label: 'Minhas Atividades',
        href: '/dashboard/activities',
        icon: BookOpen,
      },
    ],
  },
  {
    label: 'Pagamentos',
    href: '/dashboard/payments',
    icon: CreditCard,
  },

  // Admin Section
  {
    label: 'Administração',
    icon: Shield,
    roles: ['ADMIN', 'STAFF'],
    children: [
      {
        label: 'Dashboard Admin',
        href: '/admin',
        icon: BarChart3,
        roles: ['ADMIN', 'STAFF'],
      },
      {
        label: 'Usuários',
        href: '/admin/users',
        icon: Users,
        roles: ['ADMIN'],
        permissions: ['MANAGE_USERS'],
      },
      {
        label: 'Acomodações',
        href: '/admin/accommodations',
        icon: Building,
        roles: ['ADMIN', 'STAFF'],
        permissions: ['MANAGE_ACCOMMODATIONS'],
      },
      {
        label: 'Reservas',
        href: '/admin/reservations',
        icon: Calendar,
        roles: ['ADMIN', 'STAFF'],
        permissions: ['MANAGE_RESERVATIONS'],
      },
      {
        label: 'Atividades',
        href: '/admin/activities',
        icon: BookOpen,
        roles: ['ADMIN', 'STAFF'],
        permissions: ['MANAGE_ACTIVITIES'],
      },
      {
        label: 'Relatórios',
        href: '/admin/reports',
        icon: BarChart3,
        roles: ['ADMIN', 'STAFF'],
        permissions: ['VIEW_REPORTS'],
      },
      {
        label: 'Configurações',
        href: '/admin/settings',
        icon: Settings,
        roles: ['ADMIN'],
        permissions: ['MANAGE_SETTINGS'],
      },
    ],
  },

  {
    label: 'Suporte',
    icon: HelpCircle,
    children: [
      {
        label: 'Central de Ajuda',
        href: '/help',
        icon: HelpCircle,
      },
      {
        label: 'Documentação',
        href: '/docs',
        icon: FileText,
      },
      {
        label: 'Contato',
        href: '/contact',
        icon: MessageSquare,
      },
    ],
  },
]

interface SidebarItemComponentProps {
  item: SidebarItem
  level?: number
}

function SidebarItemComponent({ item, level = 0 }: SidebarItemComponentProps) {
  const location = useLocation()
  const { hasRole, hasPermission } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  // Check if user has required permissions
  const hasAccess = () => {
    if (item.roles && !item.roles.some(role => hasRole(role))) {
    if (item.permissions && !item.permissions.some(permission => hasPermission(permission))) {
      return false
    }

      return false
    }

    return true
  }

  if (!hasAccess()) {
    return null
  }

  const isActive = item.href && location.pathname === item.href
  const hasActiveChild = item.children?.some(child => 
    child.href && location.pathname.startsWith(child.href)
  )

  const Icon = item.icon

  // If item has children, render as collapsible
  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-left transition-colors',
            level > 0 && 'ml-4',
            hasActiveChild
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-1">
          {item.children.map((child, index) => (
            <SidebarItemComponent 
              key={child.href || index} 
              item={child} 
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // Regular item with link
  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
        level > 0 && 'ml-4',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="text-xs ml-auto">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

export function Sidebar() {
  const { user } = useAuthStore()

  return (
    <div className="flex flex-col h-full py-6">
      {/* User info */}
      <div className="px-6 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item, index) => (
          <SidebarItemComponent key={item.href || index} item={item} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-6 pt-6 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Pro-Mata</span>
          <span>v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
        </div>
      </div>
    </div>
  )
}