// Shapes of data we send to & receive from the auth API endpoints

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  name: string;
}

// The logged-in user we keep in memory (no token here — that lives in AuthService)
export interface CurrentUser {
  username: string;
  email: string;
  name: string;
}
