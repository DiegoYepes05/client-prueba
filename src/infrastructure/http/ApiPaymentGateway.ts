import { Order } from "../../domain/entities/Order";
import {
  CardInfo,
  Transaction,
  PaymentStatus,
  TransactionDetail,
} from "../../domain/entities/Transaction";
import { PaymentGateway } from "../../domain/ports/PaymentGateway";

import { getApiUrl } from "./config";

const API_URL = getApiUrl();

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
        shipping_info: {
          address: order.shippingInfo.address,
          city: order.shippingInfo.city,
          department: order.shippingInfo.department || "N/A",
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

  async getTransactionDetail(
    transactionId: string,
  ): Promise<TransactionDetail> {
    const res = await fetch(`${API_URL}/payment/transaction/${transactionId}`);
    if (!res.ok)
      throw new Error("No se pudo obtener el detalle de la transacción");
    const response = await res.json();
    const d = response.data;

    return {
      id: d.id,
      createdAt: d.created_at,
      finalizedAt: d.finalized_at,
      amountInCents: d.amount_in_cents,
      reference: d.reference,
      currency: d.currency,
      paymentMethodType: d.payment_method_type,
      paymentMethod: {
        type: d.payment_method.type,
        extra: d.payment_method.extra
          ? {
              name: d.payment_method.extra.name,
              brand: d.payment_method.extra.brand,
              cardType: d.payment_method.extra.card_type,
              lastFour: d.payment_method.extra.last_four,
              processorResponseCode:
                d.payment_method.extra.processor_response_code,
            }
          : undefined,
        installments: d.payment_method.installments,
      },
      status: d.status,
      statusMessage: d.status_message,
      merchant: {
        id: d.merchant.id,
        name: d.merchant.name,
        legalName: d.merchant.legal_name,
        contactName: d.merchant.contact_name,
        phoneNumber: d.merchant.phone_number,
        logoUrl: d.merchant.logo_url,
        email: d.merchant.email,
        legalId: d.merchant.legal_id,
        legalIdType: d.merchant.legal_id_type,
      },
    };
  }

  async getPaymentsStatus(): Promise<any[]> {
    const res = await fetch(`${API_URL}/payment/payments-status`);
    if (!res.ok) throw new Error("No se pudieron obtener las transacciones");
    return await res.json();
  }
}
