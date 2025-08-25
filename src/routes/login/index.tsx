import { createFileRoute } from '@tanstack/react-router';
import { LoginCard } from '../../features/auth/components/LoginCard';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PRÓ-MATA</h1>
          <p className="text-gray-600 mt-2">Faça login para continuar</p>
        </div>
        
        <LoginCard />
      </div>
    </div>
  );
}
