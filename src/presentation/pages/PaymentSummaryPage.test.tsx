import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import PaymentSummaryPage from "./PaymentSummaryPage";
import { renderWithProviders } from "@/test-utils";

describe("PaymentSummaryPage", () => {
  const mockOrder = {
    product: {
      name: "Producto Test",
      price: 100000,
      imageUrl: "http://test.com/img.jpg",
    },
    shippingInfo: {
      fullName: "Juan Perez",
      address: "Calle 123",
      city: "Bogotá",
      country: "Colombia",
      phone: "3001234567",
    },
    quantity: 1,
    subtotal: 100000,
    baseFee: 15000,
    shippingFee: 10000,
    totalAmount: 125000,
  };

  const mockCardInfo = {
    cardNumber: "4242 4242 4242 4242",
    cardHolder: "JUAN PEREZ",
    expiryDate: "12/29",
    cvv: "123",
  };

  test("debe mostrar el resumen completo", () => {
    renderWithProviders(<PaymentSummaryPage />, {
      preloadedState: {
        order: {
          order: mockOrder,
          cardInfo: mockCardInfo,
        } as any,
      },
    });

    expect(screen.getAllByText(/Juan Perez/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Calle 123/i)).toBeInTheDocument();
    expect(screen.getByText(/Tarjeta terminada en 4242/i)).toBeInTheDocument();
    expect(screen.getAllByText(/JUAN PEREZ/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Producto Test/i)).toBeInTheDocument();
  });

  test("debe mostrar mensaje de error si no hay datos", () => {
    renderWithProviders(<PaymentSummaryPage />, {
      preloadedState: {
        order: {
          order: null,
          cardInfo: null,
        } as any,
      },
    });

    expect(screen.getByText(/Datos incompletos/i)).toBeInTheDocument();
  });

  test("debe navegar a la página de procesamiento al confirmar", () => {
    renderWithProviders(<PaymentSummaryPage />, {
      preloadedState: {
        order: {
          order: mockOrder,
          cardInfo: mockCardInfo,
        } as any,
      },
    });

    const confirmButton = screen.getAllByText(/Comprar ahora/i)[0];
    fireEvent.click(confirmButton);
  });

  test("debe mostrar CARD si la marca no es detectable", () => {
    renderWithProviders(<PaymentSummaryPage />, {
      preloadedState: {
        order: {
          order: mockOrder,
          cardInfo: { ...mockCardInfo, cardNumber: "9999 9999 9999 9999" },
        } as any,
      },
    });

    expect(screen.getAllByText(/CARD/i)[0]).toBeInTheDocument();
  });
});
