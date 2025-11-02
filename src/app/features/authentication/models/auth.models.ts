export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data?: Tokens;
  message?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SessionInfo {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}
