import { registerUserAdminRequest } from "@/api/user";
import { appToast } from "@/components/toast/toast";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: registerUserAdminRequest,
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? "Erro inesperado";

      appToast.error(message);
    },
  });
}
