import { registerUserAdminRequest } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: registerUserAdminRequest,
  });
}