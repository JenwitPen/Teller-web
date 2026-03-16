import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { accountService } from '../services/accountService';
import { authService } from '../services/authService';
import type { Account } from '../types/account';

export const useAccountDetail = (accountId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  const fetchAccount = useCallback(async () => {
    if (!accountId || !authService.isAuthenticated()) return;
    
    setLoading(true);
    try {
      const result = await accountService.getAccounts({ account_id: accountId });
      if (result && result.length > 0) {
        setAccount(result[0]);
      } else {
        setAccount(null);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        message.error(error.response?.data?.message || 'Failed to fetch account details');
      }
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    loading,
    account,
    fetchAccount,
  };
};
