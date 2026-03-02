import { screen, fireEvent, act } from "@testing-library/react";
import ShippingPaymentPage from "./ShippingPaymentPage";
import { renderWithProviders } from "@/test-utils";

describe("ShippingPaymentPage", () => {
  const mockProduct = {
    id: "1",
    name: "Reloj Elegante",
    price: 350000,
    imageUrl: "https://example.com/image.jpg",
    description: "Un gran reloj",
    stock: 10,
  };

  const mockMerchant = {
    id: 1,
    name: "Comercio",
    public_key: "pub_123",
    presigned_acceptance: {
      acceptance_token: "acc-123",
      permalink: "https://terms.com",
      type: "ACCEPTANCE",
    },
    presigned_personal_data_auth: {
      acceptance_token: "data-123",
      permalink: "https://data.com",
      type: "PERSONAL_DATA",
    },
  };

  test("debe mostrar errores de validación si los campos están vacíos", async () => {
    await act(async () => {
      renderWithProviders(<ShippingPaymentPage />, {
        preloadedState: {
          order: {
            product: mockProduct,
            acceptedTerms: true,
            acceptedData: true,
            merchant: mockMerchant,
            loading: false,
          } as any,
        },
      });
    });

    const submitButton = screen.getByText(/Continuar al pago/i);
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Nombre requerido/i)).toBeInTheDocument();
  });

  test("debe permitir llenar el formulario y continuar", async () => {
    let storeResult: any;
    await act(async () => {
      const { store } = renderWithProviders(<ShippingPaymentPage />, {
        preloadedState: {
          order: {
            product: mockProduct,
            acceptedTerms: true,
            acceptedData: true,
            merchant: mockMerchant,
            loading: false,
          } as any,
        },
      });
      storeResult = store;
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
        target: { value: "Juan Perez" },
      });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: "juan@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Teléfono/i), {
        target: { value: "3001234567" },
      });
      fireEvent.change(screen.getByLabelText(/Dirección/i), {
        target: { value: "Calle 123" },
      });
      fireEvent.change(screen.getByLabelText(/Ciudad/i), {
        target: { value: "Bogotá" },
      });
    });

    const submitButton = screen.getByText(/Continuar al pago/i);
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const state = storeResult.getState();
    expect(state.order.order.shippingInfo.fullName).toBe("Juan Perez");
  });

  test("el botón debe estar deshabilitado si no se aceptan términos", async () => {
    await act(async () => {
      renderWithProviders(<ShippingPaymentPage />, {
        preloadedState: {
          order: {
            product: mockProduct,
            acceptedTerms: false,
            acceptedData: false,
            merchant: mockMerchant,
            loading: false,
          } as any,
        },
      });
    });

    const submitButton = screen.getByText(/Continuar al pago/i);
    expect(submitButton).toBeDisabled();
  });
});
