import { ProcessPaymentUseCase } from "./ProcessPaymentUseCase";
import { PaymentGateway } from "../domain/ports/PaymentGateway";
import { Order } from "../domain/entities/Order";
import { CardInfo, Transaction } from "../domain/entities/Transaction";

describe("ProcessPaymentUseCase", () => {
  let useCase: ProcessPaymentUseCase;
  let mockPaymentGateway: jest.Mocked<PaymentGateway>;

  const mockOrder: Order = {
    product: {
      id: "1",
      name: "Product",
      price: 100,
      imageUrl: "",
      description: "",
      stock: 10,
    },
    quantity: 1,
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      address: "123 Main St",
      city: "City",
      country: "Country",
      phone: "1234567890",
    },
    subtotal: 100,
    baseFee: 15000,
    shippingFee: 10000,
    totalAmount: 25100,
  };

  const mockCardInfo: CardInfo = {
    cardNumber: "4242 4242 4242 4242",
    cardHolder: "John Doe",
    expiryDate: "12/29",
    cvv: "123",
  };

  const mockTransaction: Transaction = {
    id: "tx-123",
    orderId: "1",
    status: "APPROVED",
    amount: 25100,
    cardLastFour: "4242",
    reference: "REF-123",
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockPaymentGateway = {
      tokenizeCard: jest.fn(),
      processPayment: jest.fn(),
      getTransactionStatus: jest.fn(),
    };
    useCase = new ProcessPaymentUseCase(mockPaymentGateway);
  });

  test("debe tokenizar la tarjeta exitosamente", async () => {
    mockPaymentGateway.tokenizeCard.mockResolvedValue("token-123");

    const result = await useCase.tokenizeCard(mockCardInfo);

    expect(result).toBe("token-123");
    expect(mockPaymentGateway.tokenizeCard).toHaveBeenCalledWith(mockCardInfo);
  });

  test("debe procesar el pago exitosamente", async () => {
    mockPaymentGateway.processPayment.mockResolvedValue(mockTransaction);

    const result = await useCase.execute(mockOrder, "token-123", "acc-123");

    expect(result).toEqual(mockTransaction);
    expect(mockPaymentGateway.processPayment).toHaveBeenCalledWith(
      mockOrder,
      "token-123",
      "acc-123",
    );
  });

  test("debe lanzar un error si la orden está incompleta", async () => {
    const incompleteOrder = { ...mockOrder, product: null } as any;

    await expect(
      useCase.execute(incompleteOrder, "token-123", "acc-123"),
    ).rejects.toThrow("Orden incompleta");
  });
});
