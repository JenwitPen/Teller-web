import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { accountService } from '../services/accountService';
import { authService } from '../services/authService';
import type { CreateAccountRequest } from '../types/account';

export const useCreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createAccount = async (values: CreateAccountRequest) => {
    if (!authService.isAuthenticated()) return;
    setLoading(true);
    try {
      await accountService.createAccount(values);
      message.success('Account created successfully!');
      navigate('/accounts');
    } catch (error: any) {
      if (error.response?.status !== 401) {
        const errorMsg = error.response?.data?.message || 'Failed to create account';
        message.error(errorMsg);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createAccount,
  };
};
