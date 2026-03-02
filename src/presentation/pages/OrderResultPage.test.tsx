import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import OrderResultPage from "./OrderResultPage";
import { renderWithProviders } from "@/test-utils";

describe("OrderResultPage", () => {
  const mockTransaction = {
    id: "tx-123",
    status: "APPROVED",
    amount: 100000,
    reference: "REF-123",
    cardLastFour: "4242",
    createdAt: new Date(),
  };

  const mockOrder = {
    product: { name: "Producto de Prueba", price: 100000 },
    shippingInfo: { email: "test@example.com" },
  };

  test("debe mostrar el estado de éxito correctamente", () => {
    renderWithProviders(<OrderResultPage />, {
      preloadedState: {
        order: {
          transaction: mockTransaction,
          order: mockOrder,
        } as any,
      },
    });

    expect(screen.getByText(/¡Pago Exitoso!/i)).toBeInTheDocument();
    expect(screen.getByText(/REF-123/i)).toBeInTheDocument();
  });

  test("debe mostrar el estado de error correctamente", () => {
    renderWithProviders(<OrderResultPage />, {
      preloadedState: {
        order: {
          transaction: { ...mockTransaction, status: "DECLINED" },
          order: mockOrder,
        } as any,
      },
    });

    expect(screen.getByText(/Pago Rechazado/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Hubo un problema con tu método de pago/i),
    ).toBeInTheDocument();
  });

  test("debe navegar al inicio al hacer clic en finalizar", () => {
    const { store } = renderWithProviders(<OrderResultPage />, {
      preloadedState: {
        order: {
          transaction: mockTransaction,
          order: mockOrder,
        } as any,
      },
    });

    const finishButton = screen.getByText(/Seguir comprando/i);
    fireEvent.click(finishButton);



    const state = store.getState();
    expect(state.order.transaction).toBeNull();
  });
});
