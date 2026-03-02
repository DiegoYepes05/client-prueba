import { TransactionDetail } from "../domain/entities/Transaction";
import { PaymentGateway } from "../domain/ports/PaymentGateway";

export class GetTransactionDetailUseCase {
  constructor(private paymentGateway: PaymentGateway) {}

  async execute(transactionId: string): Promise<TransactionDetail> {
    return this.paymentGateway.getTransactionDetail(transactionId);
  }
}
