import { registerUserRequest } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUserRequest,
  });
}
