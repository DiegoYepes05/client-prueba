import { ApiPaymentGateway } from "./ApiPaymentGateway";
import { Order } from "../../domain/entities/Order";
import { CardInfo } from "../../domain/entities/Transaction";

describe("ApiPaymentGateway", () => {
  let gateway: ApiPaymentGateway;

  beforeEach(() => {
    gateway = new ApiPaymentGateway();

    global.fetch = jest.fn();
  });

  const mockCardInfo: CardInfo = {
    cardNumber: "4242 4242 4242 4242",
    cardHolder: "JUAN PEREZ",
    expiryDate: "12/29",
    cvv: "123",
  };

  const mockOrder: Order = {
    product: {
      id: "p1",
      name: "Prod",
      price: 100,
      imageUrl: "",
      description: "",
      stock: 10,
    },
    quantity: 1,
    shippingInfo: {
      fullName: "Juan Perez",
      email: "juan@example.com",
      address: "Calle 1",
      city: "Bogota",
      country: "CO",
      phone: "3001234567",
    },
    subtotal: 100,
    baseFee: 15000,
    shippingFee: 10000,
    totalAmount: 25100,
  };

  test("debe tokenizar la tarjeta correctamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: "token-123" } }),
    });

    const token = await gateway.tokenizeCard(mockCardInfo);

    expect(token).toBe("token-123");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/create-card-token"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  test("debe lanzar un error si falla la tokenización", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Tarjeta inválida" }),
    });

    await expect(gateway.tokenizeCard(mockCardInfo)).rejects.toThrow(
      "Tarjeta inválida",
    );
  });

  test("debe usar mensaje por defecto si falla la tokenización sin mensaje", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(gateway.tokenizeCard(mockCardInfo)).rejects.toThrow(
      "Error al tokenizar la tarjeta",
    );
  });

  test("debe procesar el pago correctamente", async () => {
    const mockResponse = {
      data: {
        id: "tx-123",
        status: "APPROVED",
        amount_in_cents: 2510000,
        reference: "REF-123",
        created_at: "2024-03-01T12:00:00Z",
        payment_method: { extra: { last_four: "4242" } },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await gateway.processPayment(
      mockOrder,
      "token-123",
      "acc-123",
    );

    expect(result.id).toBe("tx-123");
    expect(result.status).toBe("APPROVED");
    expect(result.amount).toBe(25100);
    expect(result.cardLastFour).toBe("4242");
  });

  test("debe lanzar un error si falla el procesamiento del pago", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Fondos insuficientes" }),
    });

    await expect(
      gateway.processPayment(mockOrder, "token-123", "acc-123"),
    ).rejects.toThrow("Fondos insuficientes");
  });

  test("debe usar mensaje por defecto si falla el proceso sin mensaje", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(
      gateway.processPayment(mockOrder, "token-123", "acc-123"),
    ).rejects.toThrow("Error al procesar el pago");
  });

  test("debe obtener el estado de la transacción correctamente", async () => {
    const mockTx = {
      id: "tx-123",
      status: "APPROVED",
      amount: 25100,
      createdAt: "2024-03-01T12:00:00Z",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTx,
    });

    const result = await gateway.getTransactionStatus("tx-123");

    expect(result.status).toBe("APPROVED");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test("debe lanzar error si falla getTransactionStatus", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(gateway.getTransactionStatus("tx-123")).rejects.toThrow(
      "No se pudo obtener el estado de la transacción",
    );
  });
});
