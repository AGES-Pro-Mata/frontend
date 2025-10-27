import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "@/api/user";
import { useNavigate } from "@tanstack/react-router";
import { appToast } from "@/components/toast/toast";
import { t } from "i18next";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleChangePassword = (token: string) => {
    void navigate({ to: `/auth/redefine/${token}` });
  };

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.data?.isFirstAccess) {
          appToast.warning(t("auth.login.toastWarning"));

          return handleChangePassword(response.data.token);
        }
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          await queryClient.invalidateQueries({ queryKey: ["me"] });
          await queryClient.refetchQueries({ queryKey: ["me"] });
          appToast.success(t("auth.login.toastSuccess"));
          void navigate({ to: "/" });
        }
      } else {
        appToast.error(response.message || t("auth.login.toastError"));
      }
    },
    onError: () => {
      appToast.error(t("auth.login.toastErrorTryAgain"));
    },
  });
}
