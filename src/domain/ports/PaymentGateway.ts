import { Order } from "../entities/Order";
import { CardInfo, Transaction } from "../entities/Transaction";

export interface PaymentGateway {
  tokenizeCard(cardInfo: CardInfo): Promise<string>;
  processPayment(
    order: Order,
    cardToken: string,
    acceptanceToken: string,
  ): Promise<Transaction>;
  getTransactionStatus(transactionId: string): Promise<Transaction>;
}
