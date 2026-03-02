import { Order } from "../entities/Order";
import {
  CardInfo,
  Transaction,
  PaymentStatus,
  TransactionDetail,
} from "../entities/Transaction";

export interface PaymentGateway {
  tokenizeCard(cardInfo: CardInfo): Promise<string>;
  processPayment(
    order: Order,
    cardToken: string,
    acceptanceToken: string,
  ): Promise<Transaction>;
  getTransactionDetail(transactionId: string): Promise<TransactionDetail>;
  getPaymentsStatus(): Promise<PaymentStatus[]>;
}
