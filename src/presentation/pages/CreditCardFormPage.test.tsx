import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import CreditCardFormPage from "./CreditCardFormPage";
import { renderWithProviders } from "@/test-utils";

describe("CreditCardFormPage", () => {
  test("debe formatear el número de tarjeta mientras se escribe", () => {
    renderWithProviders(<CreditCardFormPage />, {
      preloadedState: {
        order: {
          cardInfo: {
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvv: "",
          },
        } as any,
      },
    });

    const cardInput = screen.getByLabelText(
      /Número de tarjeta/i,
    ) as HTMLInputElement;
    fireEvent.change(cardInput, { target: { value: "4242424242424242" } });

    expect(cardInput.value).toBe("4242 4242 4242 4242");
  });

  test("debe mostrar error si el número de tarjeta es corto", () => {
    renderWithProviders(<CreditCardFormPage />, {
      preloadedState: {
        order: {
          cardInfo: {
            cardNumber: "4242",
            cardHolder: "JUAN PEREZ",
            expiryDate: "12/29",
            cvv: "123",
          },
        } as any,
      },
    });

    const submitButton = screen.getByText(/Revisar pedido/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Número incompleto/i)).toBeInTheDocument();
  });

  test("debe detectar la franquicia (VISA)", () => {
    renderWithProviders(<CreditCardFormPage />, {
      preloadedState: {
        order: {
          cardInfo: {
            cardNumber: "4",
            cardHolder: "",
            expiryDate: "",
            cvv: "",
          },
        } as any,
      },
    });

    expect(screen.getAllByText(/VISA/i)[0]).toBeInTheDocument();
  });

  test("debe permitir continuar si el formulario es válido", () => {
    const { store } = renderWithProviders(<CreditCardFormPage />, {
      preloadedState: {
        order: {
          cardInfo: {
            cardNumber: "4242 4242 4242 4242",
            cardHolder: "JUAN PEREZ",
            expiryDate: "12/29",
            cvv: "123",
          },
        } as any,
      },
    });

    const submitButton = screen.getByText(/Revisar pedido/i);
    fireEvent.click(submitButton);

    const state = store.getState();
    expect(state.order.cardInfo.cardNumber).toBe("4242 4242 4242 4242");
  });

  test("debe mostrar todos los errores de validación si los campos están vacíos", () => {
    renderWithProviders(<CreditCardFormPage />, {
      preloadedState: {
        order: {
          cardInfo: {
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvv: "",
          },
        } as any,
      },
    });

    const submitButton = screen.getByText(/Revisar pedido/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Número incompleto/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha inválida/i)).toBeInTheDocument();
    expect(screen.getByText(/CVV inválido/i)).toBeInTheDocument();
  });
});
