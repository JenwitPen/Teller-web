import axiosInstance from '../api/axiosInstance';
import type { Account, GetAccountQuery, CreateAccountRequest, AccountListResponse } from '../types/account';

export const accountService = {
  getAccounts: async (params: GetAccountQuery): Promise<AccountListResponse> => {
    const response = await axiosInstance.get('/accounts', { params,  headers: {
        'x-request-id': crypto.randomUUID(),
      } });
    return response.data;

  },

  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await axiosInstance.post('/accounts', data, {
      headers: {
        'x-request-id': crypto.randomUUID(),
      }
    });
    return response.data;
  },


  updateAccount: async (data: any): Promise<Account> => {
    const response = await axiosInstance.post('/accounts/edit', data, {
      headers: {
        'x-request-id': crypto.randomUUID(),
      }
    });
    return response.data;
  }
};
