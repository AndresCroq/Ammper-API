export interface Bank {
  id: string;
  account: Account;
  created_at: string;
  category: string;
  subcategory: null;
  merchant: Merchant;
  collected_at: string;
  currency: string;
  description: string;
  internal_identification: string;
  value_date: string;
  accounting_date: string;
  amount: number;
  type: string;
  status: string;
  reference: string;
  balance: number;
  observations: null | string;
}

export interface Account {
  id: string;
  link: string;
  institution: Institution;
  created_at: string;
  collected_at: string;
  currency: string;
  category: string;
  type: string;
  number: string;
  agency: string;
  bank_product_id: string;
  internal_identification: string;
  public_identification_name: string;
  public_identification_value: string;
  credit_data: CreditData;
  loan_data: null | any;
  name: string;
  balance: Balance;
  last_accessed_at: string;
  balance_type: string;
}

export interface Balance {
  current: number;
  available: number;
}

export interface CreditData {
  collected_at: string;
  credit_limit: number;
  cutting_date: string;
  next_payment_date: string;
  minimum_payment: number;
  monthly_payment: number;
  no_interest_payment: number;
  last_payment_date: string;
  last_period_balance: number;
  interest_rate: number;
}

export interface Institution {
  name: string;
  type: string;
}

export interface Merchant {
  name: string;
  website: string;
  logo: string;
}
