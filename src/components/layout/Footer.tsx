import { Link } from '@tanstack/react-router'
import { 
  ExternalLink,
  Facebook,
  Instagram, 
  Mail,
  MapPin, 
  Phone, 
  Twitter,
  Youtube,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

const FOOTER_LINKS = {
  navigation: [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/about' },
    { label: 'Acomodações', href: '/accommodations' },
    { label: 'Atividades', href: '/activities' },
    { label: 'Contato', href: '/contact' },
  ],
  services: [
    { label: 'Reservas', href: '/reservations' },
    { label: 'Hospedagem', href: '/accommodations' },
    { label: 'Trilhas', href: '/activities?type=trail' },
    { label: 'Pesquisa', href: '/research' },
    { label: 'Eventos', href: '/events' },
  ],
  support: [
    { label: 'Central de Ajuda', href: '/help' },
    { label: 'Política de Cancelamento', href: '/policies/cancellation' },
    { label: 'Termos de Uso', href: '/terms' },
    { label: 'Política de Privacidade', href: '/privacy' },
    { label: 'FAQ', href: '/faq' },
  ],
  institutional: [
    { label: 'PUCRS', href: 'https://www.pucrs.br', external: true },
    { label: 'Pesquisa Científica', href: '/research' },
    { label: 'Educação Ambiental', href: '/education' },
    { label: 'Conservação', href: '/conservation' },
    { label: 'Sustentabilidade', href: '/sustainability' },
  ],
}

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/promata',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/promata',
    icon: Instagram,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/promata',
    icon: Youtube,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/promata',
    icon: Twitter,
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/images/pro-mata-logo.png"
                alt="Pro-Mata"
                className="h-8 w-8"
              />
              <span className="font-bold text-lg text-primary">Pro-Mata</span>
            </div>
            
            <p className="text-sm text-muted-foreground max-w-md">
              Centro de Pesquisas e Proteção da Natureza Pró-Mata - Um espaço dedicado 
              à conservação, pesquisa científica e educação ambiental em plena Mata Atlântica.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>São Francisco de Paula, RS - Brasil</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(54) 3290-1100</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>promata@pucrs.br</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Navegação</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Serviços</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Suporte</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup */}
            <div className="pt-4 space-y-2">
              <h4 className="text-sm font-medium">Newsletter</h4>
              <p className="text-xs text-muted-foreground">
                Receba novidades e ofertas especiais
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Seu e-mail"
                  className="h-8 text-sm"
                />
                <Button size="sm" className="h-8">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Pro-Mata. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Uma iniciativa da</span>
              <a
                href="https://www.pucrs.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline inline-flex items-center space-x-1"
              >
                <span>PUCRS</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Termos
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacidade
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cookies
            </Link>
          </div>
        </div>

        {/* Environmental Certification */}
        <div className="mt-8 pt-8 border-t border-muted">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-pro-mata-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <p className="text-sm font-medium">Certificado Ambientalmente Responsável</p>
                <p className="text-xs text-muted-foreground">
                  Comprometidos com a conservação da Mata Atlântica
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">
                Desenvolvido com 💚 para a natureza
              </p>
              <p className="text-xs text-muted-foreground">
                v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}