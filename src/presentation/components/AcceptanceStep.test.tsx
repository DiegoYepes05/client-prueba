import { screen, fireEvent, act } from "@testing-library/react";
import { AcceptanceStep } from "./AcceptanceStep";
import { renderWithProviders } from "@/test-utils";
import { fetchMerchant } from "@/infrastructure/state/slices/orderSlice";

jest.mock("@/infrastructure/state/slices/orderSlice", () => ({
  ...jest.requireActual("@/infrastructure/state/slices/orderSlice"),
  fetchMerchant: jest.fn(() => ({ type: "neutral" })),
}));

describe("AcceptanceStep", () => {
  const mockMerchant = {
    id: 1,
    name: "Comercio de Prueba",
    public_key: "pub_123",
    presigned_acceptance: {
      acceptance_token: "acc_123",
      permalink: "https://terms.com",
      type: "ACCEPTANCE",
    },
    presigned_personal_data_auth: {
      acceptance_token: "data_123",
      permalink: "https://data.com",
      type: "PERSONAL_DATA",
    },
  };

  test("debe mostrar los checkboxes de aceptación", async () => {
    await act(async () => {
      renderWithProviders(<AcceptanceStep />, {
        preloadedState: {
          order: {
            merchant: mockMerchant,
            acceptedTerms: false,
            acceptedData: false,
            loading: false,
            transaction: null,
            product: null,
            quantity: 1,
            shippingInfo: null,
            order: null,
            error: null,
          } as any,
        },
      });
    });

    expect(
      screen.getByLabelText(/Acepto haber leído los/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Acepto la autorización para la administración/i),
    ).toBeInTheDocument();
  });

  test("debe despachar la acción de setAcceptance al cambiar los términos", async () => {
    let storeResult: any;
    await act(async () => {
      const { store } = renderWithProviders(<AcceptanceStep />, {
        preloadedState: {
          order: {
            merchant: mockMerchant,
            acceptedTerms: false,
            acceptedData: false,
            loading: false,
          } as any,
        },
      });
      storeResult = store;
    });

    const termsCheckbox = screen.getByLabelText(/Acepto haber leído los/i);
    await act(async () => {
      fireEvent.click(termsCheckbox);
    });

    const state = storeResult.getState();
    expect(state.order.acceptedTerms).toBe(true);
  });

  test("no debe renderizar nada si no hay información del comercio", async () => {
    let containerResult: any;
    await act(async () => {
      const { container } = renderWithProviders(<AcceptanceStep />, {
        preloadedState: {
          order: {
            merchant: null,
            loading: false,
          } as any,
        },
      });
      containerResult = container;
    });

    expect(containerResult.firstChild).toBeNull();
  });
});
