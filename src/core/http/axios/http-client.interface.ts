import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T>>
  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>>
  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>>
  delete<T>(
    url: string,
    config?: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<T>>
  setBaseURL(baseURL: string): void
}
