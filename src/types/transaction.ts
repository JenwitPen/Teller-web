export type TransactionType = 'DEPOSIT' | 'WITHDRAW';

export interface Transaction {
  id: number;
  account_id: string;
  account_name: string;
  amount: number;
  balance_after: number;
  transaction_type: TransactionType;
  description?: string;
  transaction_date: string;
  branch_code?: string;
  employee_id?: string;
}

export interface TransactionHistoryQuery {
  account_id?: string;
  transaction_type?: TransactionType;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface TransactionRequest {
  account_id: string;
  amount: number;
  transaction_type: TransactionType;
  branch_code?: string;
  employee_id?: string;
  description?: string;
}

export interface TransactionResponse {
  account_id: string;
  balance: number;
}
