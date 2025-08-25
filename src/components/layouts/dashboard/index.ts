'use client'
import { ContentLayout } from './content.layout'
import { FooterLayout } from './footer.layout'
import { HeaderLayout } from './header.layout'
import { RootLayout } from './root.layout'

const Layout = Object.assign(RootLayout, {
  Header: HeaderLayout,
  Content: ContentLayout,
  Footer: FooterLayout
})

export default Layout
