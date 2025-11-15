import { forgotPasswordRequest } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
}
