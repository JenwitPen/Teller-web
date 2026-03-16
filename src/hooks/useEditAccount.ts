import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { accountService } from '../services/accountService';
import { authService } from '../services/authService';

export const useEditAccount = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateAccount = async (values: any) => {
    if (!authService.isAuthenticated()) return;
    setLoading(true);
    try {
      await accountService.updateAccount(values);
      message.success('Account updated successfully!');
      navigate('/accounts');
    } catch (error: any) {
      if (error.response?.status !== 401) {
        const errorMsg = error.response?.data?.message || 'Failed to update account';
        message.error(errorMsg);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateAccount,
  };
};
