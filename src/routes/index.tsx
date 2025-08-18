import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl p-6 space-y-6">
      
          <h1 className="text-2xl font-semibold">PRÓ-MATA</h1>
          <p className="text-sm text-neutral-600">
            Plataforma de reservas e hospedagem. 
          </p>

        <nav className="flex gap-3">
          <Link to="/my-reservations" className="underline">Minhas Reservas</Link>
          <Link to="/login" className="underline">Entrar</Link>
          <Link to="/register" className="underline">Criar conta</Link>
        </nav>

        <section className="prose prose-sm max-w-none">
          <p>Bem-vindo! Esta página é um placeholder.</p>
        </section>
      </main>
    </div>
  )
}
