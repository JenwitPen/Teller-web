import axiosInstance from '../api/axiosInstance';
import type { LoginCredentials, LoginResponse, UserPayload } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

let _accessToken: string | null = null;

const COOKIE_NAME = 'teller_auth_token';

const setCookie = (name: string, value: string, minutes: number = 60) => {
  const date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict; Secure";
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure';
};

let _refreshPromise: Promise<string | null> | null = null;

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    if (response.data.access_token) {
      _accessToken = response.data.access_token;
      setCookie(COOKIE_NAME, _accessToken, 60);
    }
    return response.data;
  },

  refresh: async (): Promise<string | null> => {
    // If a refresh is already in progress, return the existing promise
    if (_refreshPromise) {
      return _refreshPromise;
    }

    _refreshPromise = (async () => {
      try {
        const token = authService.getToken();
        if (!token) return null;
        
        const response = await axiosInstance.post<LoginResponse>('/auth/refresh');
        if (response.data.access_token) {
          _accessToken = response.data.access_token;
          setCookie(COOKIE_NAME, _accessToken, 60);
          return _accessToken;
        }
        return null;
      } catch (error) {
        console.error('Silent refresh failed:', error);
        return null;
      } finally {
        _refreshPromise = null;
      }
    })();

    return _refreshPromise;
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      _accessToken = null;
      removeCookie(COOKIE_NAME);
      window.location.href = '/login';
    }
  },

  getToken: () => {
    if (!_accessToken) {
      _accessToken = getCookie(COOKIE_NAME);
    }
    return _accessToken;
  },
  
  isAuthenticated: (): boolean => {
    return !!authService.getToken() && !authService.isTokenExpired();
  },

  isTokenExpired: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<UserPayload>(token);
      if (!decoded.exp) return false;
      
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        const date = new Date(decoded.exp * 1000);
        console.log('Token expired at:', date.toLocaleString('th-TH'));
      }
      return isExpired;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Invalid token = expired/invalid
    }
  },

  getUser: (): UserPayload | null => {
    const token = authService.getToken();
    if (!token) return null;
    try {
      return jwtDecode<UserPayload>(token);
    } catch {
      return null;
    }
  },
};
