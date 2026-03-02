import { Order } from "../domain/entities/Order";
import { CardInfo, Transaction } from "../domain/entities/Transaction";
import { PaymentGateway } from "../domain/ports/PaymentGateway";

export class ProcessPaymentUseCase {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async tokenizeCard(cardInfo: CardInfo): Promise<string> {
    return this.paymentGateway.tokenizeCard(cardInfo);
  }

  async execute(
    order: Order,
    cardToken: string,
    acceptanceToken: string,
  ): Promise<Transaction> {
    if (!order.product || !order.shippingInfo) {
      throw new Error("Orden incompleta");
    }
    return this.paymentGateway.processPayment(
      order,
      cardToken,
      acceptanceToken,
    );
  }
}
