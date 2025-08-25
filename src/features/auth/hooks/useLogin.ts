import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { LoginRequest, LoginResponse, LoginError } from "../types/auth";

// Configuração centralizada do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos timeout
});

// Função que faz a chamada à API
const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  } catch (error: any) {
    // Transformar erro do axios em formato padronizado
    const loginError: LoginError = {
      message: "Usuário ou senha inválidos",
      status: error.response?.status || 500,
      code: error.response?.data?.code || "LOGIN_FAILED",
    };
    throw loginError;
  }
};

// Hook customizado
export const useLogin = () => {
  return useMutation<LoginResponse, LoginError, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Salvar token no localStorage para manter usuário logado
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      // TODO: Redirecionar para dashboard após login
      console.log("Login realizado com sucesso:", data.user.email);
    },
    onError: (error) => {
      // Log do erro para debugging (pode remover em produção)
      console.error("Erro no login:", error);

      // TODO: Enviar erro para analytics/monitoring
      // analytics.track('login_failed', { error: error.code });
    },
  });
};

// Hook auxiliar para verificar se usuário está logado
export const useAuthToken = () => {
  const getToken = () => localStorage.getItem("auth_token");
  const getUserData = () => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  };
  const clearAuth = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  return { getToken, getUserData, clearAuth };
};
