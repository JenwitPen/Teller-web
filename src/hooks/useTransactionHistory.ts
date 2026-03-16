import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { transactionService } from '../services/transactionService';
import { authService } from '../services/authService';
import type { Transaction, TransactionType } from '../types/transaction';

export const useTransactionHistory = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Transaction[]>([]);
  const [accountId, setAccountId] = useState<string>('');
  const [type, setType] = useState<TransactionType | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchHistory = useCallback(async (page: number = pagination.current, limit: number = pagination.pageSize) => {
    if (!authService.isAuthenticated()) return;
    setLoading(true);
    try {
      const query: any = {
        page: page,
        limit: limit,
      };
      if (accountId) query.account_id = accountId;
      if (type) query.transaction_type = type;
      if (dateRange && dateRange[0] && dateRange[1]) {
        query.start_date = dateRange[0].toISOString();
        query.end_date = dateRange[1].toISOString();
      }

      const result = await transactionService.getTransactionHistory(query);
      setData(result.data);

      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: limit,
        total: result.total,
      }));
    } catch (error: any) {
      if (error.response?.status !== 401) {
        message.error(error.response?.data?.message || 'Failed to fetch transaction history');
      }
    } finally {
      setLoading(false);
    }
  }, [accountId, type, dateRange, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchHistory(1);
  }, []); // Initial fetch

  const handleTableChange = (newPagination: any) => {
    fetchHistory(newPagination.current, newPagination.pageSize);
  };

  const handleClear = () => {
    setAccountId('');
    setType(undefined);
    setDateRange(null);
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(() => fetchHistory(1), 0);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    const threeMonthsAgo = dayjs().subtract(3, 'month').startOf('month');
    return current < threeMonthsAgo || current > dayjs().endOf('day');
  };

  return {
    loading,
    data,
    accountId,
    setAccountId,
    type,
    setType,
    dateRange,
    setDateRange,
    pagination,
    fetchHistory,
    handleTableChange,
    handleClear,
    disabledDate,
  };
};
