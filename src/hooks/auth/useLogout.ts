/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCartStore } from "@/store/cartStore";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const closeCart = useCartStore((state) => state.closeCart);

  const logout = () => {
    // Remove o token do localStorage
    localStorage.removeItem("token");

    // Limpa e remove o carrinho
    clearCart();
    closeCart();
    localStorage.removeItem("promata-cart");


    // Limpa todas as queries do React Query
    queryClient.clear();
    
    // Redireciona para a página de login
    navigate({ to: "/auth/login" });
  };

  return { logout };
}
