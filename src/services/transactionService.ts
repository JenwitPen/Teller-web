import axiosInstance from '../api/axiosInstance';
import type { 
  Transaction, 
  TransactionHistoryQuery, 
  TransactionRequest, 
  TransactionResponse 
} from '../types/transaction';

export const transactionService = {
  getTransactionHistory: async (query: TransactionHistoryQuery): Promise<{ data: Transaction[]; total: number }> => {
    const response = await axiosInstance.get<{ data: Transaction[]; total: number }>('/transaction-history', {
      params: query,
      headers: {
        'x-request-id': crypto.randomUUID(),
      }
    });
    return response.data;
  },

  performTransaction: async (data: TransactionRequest): Promise<TransactionResponse> => {
    const response = await axiosInstance.post<TransactionResponse>('/accounts/balance/v2', data, {
      headers: {
        'x-request-id': crypto.randomUUID(),
      }
    });
    return response.data;
  },
};
