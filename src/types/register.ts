export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  success: boolean;
  uid?: number;
  message: string;
}

export interface RegisterError {
  success: false;
  message: string;
}