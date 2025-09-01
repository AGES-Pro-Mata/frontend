import { useMutation } from '@tanstack/react-query';

interface ForgotPasswordPayload {
  email: string;
}

async function forgotPasswordRequest(payload: ForgotPasswordPayload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds
  try {
    const response = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error('Erro ao solicitar redefinição de senha');
    }
    return response.json();
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Tempo de requisição excedido. Tente novamente mais tarde.');
    }
    throw error;
  }
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
}
