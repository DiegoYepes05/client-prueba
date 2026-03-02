import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { usePayments } from "./usePayments";
import paymentReducer from "../../infrastructure/state/slices/paymentSlice";
import {
  fetchPaymentsStatus,
  fetchTransactionDetail,
} from "../../infrastructure/state/slices/paymentSlice";

// Mock the thunks
jest.mock("../../infrastructure/state/slices/paymentSlice", () => {
  const actual = jest.requireActual(
    "../../infrastructure/state/slices/paymentSlice",
  );
  return {
    ...actual,
    fetchPaymentsStatus: jest.fn(() => ({
      type: "payments/fetchStatus/pending",
    })),
    fetchTransactionDetail: jest.fn(() => ({
      type: "payments/fetchDetail/pending",
    })),
  };
});

const mockStore = (initialState?: any) =>
  configureStore({
    reducer: { payments: paymentReducer },
    preloadedState: { payments: initialState },
  });

describe("usePayments hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe retornar el estado inicial de pagos", () => {
    const store = mockStore({
      payments: [],
      loading: false,
      error: null,
      currentTransaction: null,
    });

    const { result } = renderHook(() => usePayments(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.payments).toEqual([]);
    expect(fetchPaymentsStatus).toHaveBeenCalled();
  });

  test("debe llamar a fetchTransactionDetail si se provee un ID", () => {
    const store = mockStore({
      payments: [],
      loading: false,
      error: null,
      currentTransaction: null,
    });

    renderHook(() => usePayments("tx-123"), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(fetchTransactionDetail).toHaveBeenCalledWith("tx-123");
  });
});
