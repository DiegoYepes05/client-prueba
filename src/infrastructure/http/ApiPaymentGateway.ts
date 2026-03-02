import { Order } from "../../domain/entities/Order";
import { CardInfo, Transaction } from "../../domain/entities/Transaction";
import { PaymentGateway } from "../../domain/ports/PaymentGateway";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiPaymentGateway implements PaymentGateway {
  async tokenizeCard(cardInfo: CardInfo): Promise<string> {
    const res = await fetch(`${API_URL}/payment/create-card-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: cardInfo.cardNumber.replace(/\s/g, ""),
        exp_month: cardInfo.expiryDate.split("/")[0],
        exp_year: cardInfo.expiryDate.split("/")[1],
        cvc: cardInfo.cvv,
        card_holder: cardInfo.cardHolder,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al tokenizar la tarjeta");
    }

    const data = await res.json();
    return data.data.id;
  }

  async processPayment(
    order: Order,
    cardToken: string,
    acceptanceToken: string,
  ): Promise<Transaction> {
    const res = await fetch(`${API_URL}/payment/create-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: order.product.id,
        acceptance_token: acceptanceToken,
        amount_in_cents: Math.round(order.totalAmount * 100),
        currency: "COP",
        customer_email: order.shippingInfo.email,
        payment_method: {
          type: "CARD",
          installments: 1,
          token: cardToken,
        },
        customer_data: {
          full_name: order.shippingInfo.fullName.trim(),
          phone_number: order.shippingInfo.phone.replace(/\D/g, ""),
          legal_id: "12345678",
          legal_id_type: "CC",
        },
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al procesar el pago");
    }

    const response = await res.json();
    const transactionData = response.data || response;

    return {
      id: transactionData.id,
      orderId: order.product.id,
      status: transactionData.status || "PENDING",
      amount: transactionData.amount_in_cents
        ? transactionData.amount_in_cents / 100
        : order.totalAmount,
      cardLastFour:
        transactionData.payment_method?.extra?.last_four ||
        transactionData.card_last_four ||
        "0000",
      reference: transactionData.reference || "N/A",
      createdAt: new Date(transactionData.created_at || Date.now()),
    };
  }

  async getTransactionStatus(transactionId: string): Promise<Transaction> {
    const res = await fetch(`${API_URL}/payment/transaction/${transactionId}`);
    if (!res.ok)
      throw new Error("No se pudo obtener el estado de la transacción");
    const data = await res.json();
    return { ...data, createdAt: new Date(data.createdAt) };
  }
}
