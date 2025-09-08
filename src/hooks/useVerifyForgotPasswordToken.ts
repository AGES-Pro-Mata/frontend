import { verifyTokenRequest } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export function useVerifyForgotPasswordToken(token: string) {
  return useQuery({
    queryKey: ["verify-forgot-password-token", token],
    queryFn: () => verifyTokenRequest(token),
    enabled: !!token,
  });
}