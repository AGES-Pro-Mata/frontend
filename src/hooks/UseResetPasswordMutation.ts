import { useMutation } from '@tanstack/react-query';

interface ResetPasswordPayload {
  password: string;
}

async function resetPasswordRequest(payload: ResetPasswordPayload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds
  try {
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error('Erro ao redefinir a senha');
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

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPasswordRequest,
  });
}