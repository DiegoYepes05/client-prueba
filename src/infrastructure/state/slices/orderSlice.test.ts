import orderReducer, {
  setProduct,
  setCardInfo,
  setAcceptance,
  resetOrderFlow,
  setShippingInfo,
  createOrder,
  processPayment,
  fetchMerchant,
  tokenizeCard,
} from "./orderSlice";
import {
  createOrderUseCase,
  processPaymentUseCase,
  getMerchantUseCase,
} from "../../di/container";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../di/container", () => ({
  createOrderUseCase: { execute: jest.fn() },
  processPaymentUseCase: { execute: jest.fn(), tokenizeCard: jest.fn() },
  getMerchantUseCase: { execute: jest.fn() },
}));

describe("orderSlice", () => {
  const initialState = {
    product: null,
    order: null,
    cardInfo: null,
    transaction: null,
    merchant: null,
    acceptedTerms: false,
    acceptedData: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("debe retornar el estado inicial", () => {
    expect(orderReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("debe manejar createOrder thunk exitoso", async () => {
    const mockOrder = { id: "ord-1" };
    (createOrderUseCase.execute as jest.Mock).mockReturnValue(mockOrder);

    const store = configureStore({ reducer: { order: orderReducer } });
    await store.dispatch(
      createOrder({
        product: {} as any,
        quantity: 1,
        shippingInfo: {} as any,
      }) as any,
    );

    expect(store.getState().order.order).toEqual(mockOrder);
    expect(store.getState().order.loading).toBe(false);
  });

  test("debe manejar createOrder thunk fallido", async () => {
    (createOrderUseCase.execute as jest.Mock).mockImplementation(() => {
      throw new Error("Falla creacion");
    });

    const store = configureStore({ reducer: { order: orderReducer } });
    await store.dispatch(
      createOrder({
        product: {} as any,
        quantity: 1,
        shippingInfo: {} as any,
      }) as any,
    );

    expect(store.getState().order.error).toBe("Falla creacion");
  });

  test("debe manejar processPayment thunk fallido", async () => {
    (processPaymentUseCase.execute as jest.Mock).mockRejectedValue(
      new Error("Falla pago"),
    );

    const store = configureStore({ reducer: { order: orderReducer } });
    await store.dispatch(
      processPayment({
        order: {} as any,
        cardToken: "t",
        acceptanceToken: "a",
      }) as any,
    );

    expect(store.getState().order.error).toBe("Falla pago");
  });

  test("debe manejar tokenizeCard thunk fallido", async () => {
    (processPaymentUseCase.tokenizeCard as jest.Mock).mockRejectedValue(
      new Error("Falla token"),
    );

    const store = configureStore({ reducer: { order: orderReducer } });
    await store.dispatch(tokenizeCard({ cardNumber: "4242" } as any) as any);

    expect(store.getState().order.error).toBe("Falla token");
  });

  test("debe manejar fetchMerchant thunk fallido", async () => {
    (getMerchantUseCase.execute as jest.Mock).mockRejectedValue(
      new Error("Falla comercio"),
    );

    const store = configureStore({ reducer: { order: orderReducer } });
    await store.dispatch(fetchMerchant() as any);

    expect(store.getState().order.error).toBe("Falla comercio");
  });

  test("debe establecer el producto y persistir en localStorage", () => {
    const product = { id: "1", name: "Test", price: 100 };
    const nextState = orderReducer(initialState, setProduct(product as any));
    expect(nextState.product).toEqual(product);
    expect(localStorage.getItem("wompi_checkout_flow")).toContain("Test");
  });

  test("debe establecer la información de envío e inicializar la orden si no existe", () => {
    const product = { id: "1", name: "P1", price: 50000 };
    const stateWithProduct = { ...initialState, product: product as any };
    const shippingInfo = {
      email: "u@u.com",
      fullName: "U",
      phone: "1",
      address: "A",
      city: "C",
      country: "CO",
    };
    const nextState = orderReducer(
      stateWithProduct,
      setShippingInfo(shippingInfo),
    );
    expect(nextState.order).not.toBeNull();
    expect(nextState.order?.shippingInfo).toEqual(shippingInfo);
  });

  test("debe actualizar la información de envío si la orden ya existe", () => {
    const order = { id: "1", shippingInfo: { fullName: "Old" } };
    const stateWithOrder = { ...initialState, order: order as any };
    const newInfo = {
      fullName: "New",
      email: "n@n.com",
      phone: "1",
      address: "A",
      city: "C",
      country: "CO",
    };

    const nextState = orderReducer(stateWithOrder, setShippingInfo(newInfo));

    expect(nextState.order?.shippingInfo.fullName).toBe("New");
  });

  test("debe resetear el flujo y limpiar localStorage", () => {
    localStorage.setItem(
      "wompi_checkout_flow",
      JSON.stringify({ product: { name: "P" } }),
    );
    const state = orderReducer(initialState, resetOrderFlow());
    expect(localStorage.getItem("wompi_checkout_flow")).toBeNull();
  });

  test("debe manejar error al guardar en localStorage", () => {
    const setItemSpy = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    orderReducer(initialState, setProduct({ name: "P" } as any));

    expect(consoleSpy).toHaveBeenCalled();
    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
