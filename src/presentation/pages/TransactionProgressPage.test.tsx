import { screen, waitFor, act } from "@testing-library/react";
import TransactionProgressPage from "./TransactionProgressPage";
import { renderWithProviders } from "@/test-utils";
import { processPaymentUseCase } from "../../infrastructure/di/container";

// Mock de los casos de uso en el contenedor DI
jest.mock("../../infrastructure/di/container", () => ({
  processPaymentUseCase: {
    tokenizeCard: jest.fn(),
    execute: jest.fn(),
  },
  getMerchantUseCase: {
    execute: jest.fn(),
  },
  createOrderUseCase: {
    execute: jest.fn(),
  },
}));

describe("TransactionProgressPage", () => {
  const mockOrder = { id: "ord-123" };
  const mockCardInfo = { cardNumber: "4242" };
  const mockMerchant = {
    presigned_acceptance: { acceptance_token: "acc-123" },
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.clearAllMocks();
    (console.error as jest.Mock).mockRestore();
    (console.log as jest.Mock).mockRestore();
  });

  test("debe iniciar el flujo de pago después del timeout y navegar al éxito", async () => {
    (processPaymentUseCase.tokenizeCard as jest.Mock).mockResolvedValue(
      "token-123",
    );
    (processPaymentUseCase.execute as jest.Mock).mockResolvedValue({
      id: "tx-123",
      status: "APPROVED",
    });

    await act(async () => {
      renderWithProviders(<TransactionProgressPage />, {
        preloadedState: {
          order: {
            order: mockOrder,
            cardInfo: mockCardInfo,
            merchant: mockMerchant,
            loading: false,
            error: null,
          } as any,
        },
      });
    });

    expect(screen.getByText(/Procesando tu pago/i)).toBeInTheDocument();

    // Avanzar el tiempo
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Esperar a que se llamen los mocks
    await waitFor(() => {
      expect(processPaymentUseCase.tokenizeCard).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(processPaymentUseCase.execute).toHaveBeenCalled();
    });
  });

  test("debe mostrar error si falla el proceso", async () => {
    (processPaymentUseCase.tokenizeCard as jest.Mock).mockRejectedValue(
      new Error("Fallo de red"),
    );

    await act(async () => {
      renderWithProviders(<TransactionProgressPage />, {
        preloadedState: {
          order: {
            order: mockOrder,
            cardInfo: mockCardInfo,
            merchant: mockMerchant,
            loading: false,
            error: null,
          } as any,
        },
      });
    });

    // Avanzar el tiempo
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Fallo de red/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByText(/Intentar de nuevo/i);
    await act(async () => {
      retryButton.click();
    });
  });

  test("debe mostrar mensaje si faltan datos obligatorios", async () => {
    await act(async () => {
      renderWithProviders(<TransactionProgressPage />, {
        preloadedState: {
          order: {
            order: null,
            cardInfo: null,
            merchant: null,
            loading: false,
            error: null,
          } as any,
        },
      });
    });

    expect(
      screen.getByText(/Faltan datos de la transacción/i),
    ).toBeInTheDocument();

    const goHomeButton = screen.getByText(/Ir al Inicio/i);
    await act(async () => {
      goHomeButton.click();
    });
  });
});
