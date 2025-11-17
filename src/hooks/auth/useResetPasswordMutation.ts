import { resetPasswordRequest } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPasswordRequest,
  });
}