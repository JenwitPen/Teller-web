import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { accountService } from '../services/accountService';
import { authService } from '../services/authService';
import type { Account, GetAccountQuery } from '../types/account';

export const useAccounts = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Account[]>([]);
  const [filters, setFilters] = useState<GetAccountQuery>({
    account_id: '',
    branch_code: '',
    account_type: '',
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);

  const fetchAccounts = useCallback(async (params: GetAccountQuery = filters) => {
    if (!authService.isAuthenticated()) return;
    
    setLoading(true);
    try {
      const result = await accountService.getAccounts(params);
      setData(result);
      setTotal(result.length);
      setFilters(prev => ({ ...prev, ...params }));
    } catch (error: any) {
      if (error.response?.status !== 401) {
        message.error(error.response?.data?.message || 'Failed to fetch accounts');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAccounts({ ...filters, page: 1 });
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchAccounts({
      ...filters,
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  const handleSearch = () => {
    fetchAccounts({ ...filters, page: 1 });
  };

  const handleClear = () => {
    const defaultFilters = {
      account_id: '',
      branch_code: '',
      account_type: '',
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    fetchAccounts(defaultFilters);
  };

  return {
    loading,
    data,
    total,
    filters,
    setFilters,
    fetchAccounts,
    handleTableChange,
    handleSearch,
    handleClear,
  };
};
