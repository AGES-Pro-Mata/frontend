import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import type { IHttpClient } from "./http-client.interface";
import { authInterceptor } from "./interceptors/auth.interceptor";

export class AxiosHttpClient implements IHttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 3000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Adiciona interceptors de requisição
    this.client.interceptors.request.use(authInterceptor);

    // Adiciona interceptors de resposta
    // this.client.interceptors.response.use()
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>> {
    return await this.client.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>> {
    return await this.client.put<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>> {
    return await this.client.delete<T>(url, config);
  }

  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }
}
