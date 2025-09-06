export interface HttpResponse<T = any> {
  statusCode: number;
  message: string;
  error?: string | null;
  data?: T;
}
