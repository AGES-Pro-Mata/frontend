'use client'
import { ContentLayout } from './content.layout'

import { RootLayout } from './root.layout'
import { SidebarLayout } from './sidebar.layout'

const Layout = Object.assign(RootLayout, {
  Sidebar: SidebarLayout,
  Content: ContentLayout,
})

export default Layout
