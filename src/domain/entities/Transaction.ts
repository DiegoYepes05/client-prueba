export type TransactionStatus = "PENDING" | "APPROVED" | "DECLINED";

export interface CardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  status: TransactionStatus;
  amount: number;
  cardLastFour: string;
  createdAt: Date;
  reference: string;
}
