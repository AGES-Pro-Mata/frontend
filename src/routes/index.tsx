import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl p-6 space-y-6">
      
          <h1>PRÓ-MATA</h1>
          
      </main>
    </div>
  )
}
