import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "@/api/user";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          queryClient.invalidateQueries({ queryKey: ["me"] });
          queryClient.refetchQueries({ queryKey: ["me"] });
        }
      }
    },
  });
}
