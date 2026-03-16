export interface Account {
  id: number;
  account_id: string;
  account_name: string;
  balance: number;
  branch_code: string;
  account_type: string;
  currency_code: string;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface GetAccountQuery {
  account_id?: string;
  branch_code?: string;
  account_type?: string;
  page?: number;
  limit?: number;
}

export interface CreateAccountRequest {
  account_id: string;
  account_name: string;
  balance: number;
  branch_code: string;
  account_type: string;
  currency_code: string;
}

export type AccountListResponse = Account[];
