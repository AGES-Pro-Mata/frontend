'use client'
import { ContentLayout } from '@/components/layouts/dashboard/content.layout'
import { FooterLayout } from '@/components/layouts/dashboard/footer.layout'
import { HeaderLayout } from '@/components/layouts/dashboard/header.layout'
import { RootLayout } from '@/components/layouts/dashboard/root.layout'

const Layout = Object.assign(RootLayout, {
  Header: HeaderLayout,
  Content: ContentLayout,
  Footer: FooterLayout
})

export default Layout
