export type TransactionStatus = "PENDING" | "APPROVED" | "DECLINED";

export interface CardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  legalId: string;
  legalIdType: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStatus {
  id: string;
  wompiId: string;
  reference: string;
  amountInCents: number;
  currency: string;
  status: TransactionStatus;
  installments: number;
  shippingAddress: string;
  shippingCity: string;
  shippingDepartment: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  productId: string;
  user: User;
}

export interface MerchantInfo {
  id: number;
  name: string;
  legalName: string;
  contactName: string;
  phoneNumber: string;
  logoUrl: string | null;
  email: string;
  legalId: string;
  legalIdType: string;
}

export interface PaymentMethod {
  type: string;
  extra?: {
    name: string;
    brand: string;
    cardType: string;
    lastFour: string;
    processorResponseCode: string;
  };
  installments: number;
}

export interface TransactionDetail {
  id: string;
  createdAt: string;
  finalizedAt: string | null;
  amountInCents: number;
  reference: string;
  currency: string;
  paymentMethodType: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  statusMessage: string | null;
  merchant: MerchantInfo;
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
