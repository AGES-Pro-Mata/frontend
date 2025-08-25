export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  hashedPassword: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginError {
  message: string;
  code?: string;
  status?: number;
}

export type LoginState = "idle" | "loading" | "success" | "error";
