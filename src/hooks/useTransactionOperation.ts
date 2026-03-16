import { useState } from 'react';
import { message } from 'antd';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { authService } from '../services/authService';
import type { TransactionRequest } from '../types/transaction';
import type { Account } from '../types/account';

export const useTransactionOperation = () => {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const lookupAccount = async (accountId: string) => {
    if (!accountId || !authService.isAuthenticated()) return;
    setSearching(true);
    try {
      const response = await accountService.getAccounts({ account_id: accountId });
      // In this specific API, it returns an array. We expect one match for a specific ID.
      const account = response.find(a => a.account_id === accountId);
      if (account) {
        setSelectedAccount(account);
      } else {
        setSelectedAccount(null);
        message.warning('ไม่พบข้อมูลบัญชีที่ระบุ');
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Error looking up account:', error);
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูลบัญชี');
      }
      setSelectedAccount(null);
    } finally {
      setSearching(false);
    }
  };

  const performTransaction = async (values: TransactionRequest) => {
    if (!authService.isAuthenticated()) return false;
    setLoading(true);
    try {
  console.log('Transaction values:{}', values);
      const result = await transactionService.performTransaction(values);
      console.log('Transaction result:', result);
      
      // The actual API returns { account_id, balance } if successful
      if (result && result.account_id) {
        message.success('ทำรายการสำเร็จ');
        // Refresh account details to show new balance
        lookupAccount(values.account_id);
        return true;
      } else {
        message.error('ทำรายการไม่สำเร็จ');
        return false;
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Transaction error:', error);
        const errorMsg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการทำรายการ';
        message.error(errorMsg);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedAccount(null);
  };

  return {
    loading,
    searching,
    selectedAccount,
    lookupAccount,
    performTransaction,
    reset
  };
};
