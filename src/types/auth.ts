export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UserPayload {
  sub: number;
  username: string;
  role: 'ADMIN' | 'TELLER';
  iat?: number;
  exp?: number;
  branch_code: string;
  employee_id: string;
}
