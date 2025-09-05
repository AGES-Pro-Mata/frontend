
import { useMutation } from '@tanstack/react-query';
import { forgotPasswordRequest } from '../api/user';

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
}
