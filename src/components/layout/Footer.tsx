import { Link } from '@tanstack/react-router'

import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-primary border-t'>
      <div className='container mx-auto px-4 py-12 text-white'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-2 space-y-4'>
            <div className='flex items-center space-x-2'>
              <img
                src='/images/full-banner-pro-mata-green.svg'
                alt='Pro-Mata'
                className='h-90 w-110'
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-4'>
            <h2 className='text-sm font-semibold'>Entre em contato!</h2>
            <h2 className='text-sm font-semibold'>Centro de Pesquisa PRÓ-MATA</h2>
            <h2 className='text-sm font-semibold'>São Francisco de Paula - RS</h2>
          </div>

          {/* Services */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>promata@pucrs.br</h3>
            <h3 className='text-sm font-semibold'>+55 51 1234-5678</h3>
          </div>
        </div>

        <Separator className='my-8' />

        {/* Bottom section */}
        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <div className='flex flex-col items-center w-full text-center space-y-2'>
            <p className='text-sm'>
              © {currentYear} Pro-Mata. Todos os direitos reservados.
            </p>
          </div>

          <div className='flex items-center space-x-4'>
            <Link
              to='/legal/terms'
              className='text-sm text-white hover:text-foreground'
            >
              Termos
            </Link>
            <Link
              to='/legal/privacy'
              className='text-sm text-white hover:text-foreground'
            >
              Privacidade
            </Link>
            <Link
              to='/legal/cookies'
              className='text-sm text-white hover:text-foreground'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
