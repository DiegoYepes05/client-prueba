import paymentReducer, {
  fetchPaymentsStatus,
  fetchTransactionDetail,
  clearCurrentTransaction,
} from "./paymentSlice";
import {
  getPaymentsStatusUseCase,
  getTransactionDetailUseCase,
} from "../../di/container";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../di/container", () => ({
  getPaymentsStatusUseCase: { execute: jest.fn() },
  getTransactionDetailUseCase: { execute: jest.fn() },
}));

describe("paymentSlice", () => {
  const initialState = {
    payments: [],
    currentTransaction: null,
    loading: false,
    error: null,
  };

  test("debe retornar el estado inicial", () => {
    expect(paymentReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("debe limpiar la transacción actual", () => {
    const stateWithTransaction = {
      ...initialState,
      currentTransaction: { id: "1" } as any,
    };
    const nextState = paymentReducer(
      stateWithTransaction,
      clearCurrentTransaction(),
    );
    expect(nextState.currentTransaction).toBeNull();
  });

  test("debe manejar fetchPaymentsStatus thunk exitoso", async () => {
    const mockPayments = [{ id: "1" }];
    (getPaymentsStatusUseCase.execute as jest.Mock).mockResolvedValue(
      mockPayments,
    );

    const store = configureStore({ reducer: { payments: paymentReducer } });
    await store.dispatch(fetchPaymentsStatus() as any);

    expect(store.getState().payments.payments).toEqual(mockPayments);
    expect(store.getState().payments.loading).toBe(false);
  });

  test("debe manejar fetchTransactionDetail thunk exitoso", async () => {
    const mockTransaction = { id: "tx-123" };
    (getTransactionDetailUseCase.execute as jest.Mock).mockResolvedValue(
      mockTransaction,
    );

    const store = configureStore({ reducer: { payments: paymentReducer } });
    await store.dispatch(fetchTransactionDetail("tx-123") as any);

    expect(store.getState().payments.currentTransaction).toEqual(
      mockTransaction,
    );
    expect(store.getState().payments.loading).toBe(false);
  });

  test("debe manejar fetchPaymentsStatus thunk fallido", async () => {
    (getPaymentsStatusUseCase.execute as jest.Mock).mockRejectedValue(
      new Error("Error API"),
    );

    const store = configureStore({ reducer: { payments: paymentReducer } });
    await store.dispatch(fetchPaymentsStatus() as any);

    expect(store.getState().payments.error).toBe("Error API");
    expect(store.getState().payments.loading).toBe(false);
  });

  test("debe manejar fetchTransactionDetail thunk fallido", async () => {
    (getTransactionDetailUseCase.execute as jest.Mock).mockRejectedValue(
      new Error("No encontrado"),
    );

    const store = configureStore({ reducer: { payments: paymentReducer } });
    await store.dispatch(fetchTransactionDetail("404") as any);

    expect(store.getState().payments.error).toBe("No encontrado");
  });
});
