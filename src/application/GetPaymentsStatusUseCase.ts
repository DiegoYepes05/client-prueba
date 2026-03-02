import { PaymentStatus } from "../domain/entities/Transaction";
import { PaymentGateway } from "../domain/ports/PaymentGateway";

export class GetPaymentsStatusUseCase {
  constructor(private paymentGateway: PaymentGateway) {}

  async execute(): Promise<PaymentStatus[]> {
    return this.paymentGateway.getPaymentsStatus();
  }
}
