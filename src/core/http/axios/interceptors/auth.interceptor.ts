import type { InternalAxiosRequestConfig } from "axios";

export function authInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = "Bearer ".concat(token);
  }

  return config;
}
