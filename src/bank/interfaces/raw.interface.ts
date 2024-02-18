export interface BankTable {
  _id: string;
  category: string | null;
  accountCategory: string;
  merchantName: string;
  amount: number;
  type: string;
  status: string;
  balance: number;
  valueDate: string;
}
