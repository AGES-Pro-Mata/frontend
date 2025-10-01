import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    // Remove o token do localStorage
    localStorage.removeItem("token");
    
    // Limpa todas as queries do React Query
    queryClient.clear();
    
    // Redireciona para a página de login
    navigate({ to: "/auth/login" });
  };

  return { logout };
}
