import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Layout from '@/components/layouts/admin-sidebar';

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    //TODO: trocar por hook de verificação de admin
    if(false){
      throw redirect({
        to: '/'
      })
    }
  },
  component: () => (
    <Layout>
      <Layout.Sidebar />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  ),
})
