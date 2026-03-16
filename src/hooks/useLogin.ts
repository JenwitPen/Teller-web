import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { authService } from '../services/authService';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (values: any) => {
    setLoading(true);
    try {
      await authService.login(values);
      message.success('Login successful!');
      
      // Redirect to the intended path or default to home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.response?.status !== 401) {
        const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
        message.error(errorMsg);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
  };
};
