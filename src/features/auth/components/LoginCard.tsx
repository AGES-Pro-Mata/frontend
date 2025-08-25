import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLogin } from '../hooks/useLogin';
import { useHashPassword } from '../hooks/useHashPassword';
import type { LoginFormData } from '../types/auth';

// Esquema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export function LoginCard() {
  const { mutate: login, isPending, error, isError } = useLogin();
  const { hashPassword } = useHashPassword();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (data: LoginFormData) => {
    login({
      email: data.email,
      hashedPassword: hashPassword(data.password),
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-left">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...form.register('email')}
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Senha"
              {...form.register('password')}
              className={form.formState.errors.password ? 'border-red-500' : ''}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Link Esqueci a senha */}
          <div className="text-left">
            <Button variant="link" className="text-sm p-0 h-auto text-gray-600 underline">
              Esqueci a senha
            </Button>
          </div>

          {/* Mensagem de Erro da API */}
          {isError && error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Botões */}
          <div className="flex flex-col items-center space-y-3 pt-4">
            {/* Botão Entrar - mais estreito e verde */}
            <Button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md w-auto"
              disabled={isPending}
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
            
            {/* Botão Cadastre-se - sem funcionalidade */}
            <Button 
              type="button"
              variant="secondary"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md w-auto"
            >
              Cadastre-se
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}