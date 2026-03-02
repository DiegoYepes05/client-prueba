import productReducer, {
  clearCurrentProduct,
  fetchProducts,
  fetchProductById,
} from "./productSlice";
import { getProductUseCase } from "../../di/container";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../di/container", () => ({
  getProductUseCase: {
    getAll: jest.fn(),
    execute: jest.fn(),
  },
}));

describe("productSlice", () => {
  const initialState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  };

  test("debe retornar el estado inicial", () => {
    expect(productReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("debe limpiar el producto actual", () => {
    const stateWithProduct = {
      ...initialState,
      currentProduct: { id: "1", name: "Test" } as any,
    };
    const nextState = productReducer(stateWithProduct, clearCurrentProduct());
    expect(nextState.currentProduct).toBeNull();
  });

  test("debe manejar fetchProducts thunk exitoso", async () => {
    const products = [{ id: "1", name: "P1" }];
    (getProductUseCase.getAll as jest.Mock).mockResolvedValue(products);

    const store = configureStore({ reducer: { products: productReducer } });
    await store.dispatch(fetchProducts() as any);

    const state = store.getState().products;
    expect(state.products).toEqual(products);
    expect(state.loading).toBe(false);
  });

  test("debe manejar fetchProducts thunk fallido", async () => {
    (getProductUseCase.getAll as jest.Mock).mockRejectedValue(
      new Error("Error API"),
    );

    const store = configureStore({ reducer: { products: productReducer } });
    await store.dispatch(fetchProducts() as any);

    const state = store.getState().products;
    expect(state.error).toBe("Error API");
    expect(state.loading).toBe(false);
  });

  test("debe manejar fetchProductById thunk exitoso", async () => {
    const product = { id: "1", name: "P1" };
    (getProductUseCase.execute as jest.Mock).mockResolvedValue(product);

    const store = configureStore({ reducer: { products: productReducer } });
    await store.dispatch(fetchProductById("1") as any);

    const state = store.getState().products;
    expect(state.currentProduct).toEqual(product);
  });

  test("debe manejar fetchProductById thunk fallido", async () => {
    (getProductUseCase.execute as jest.Mock).mockRejectedValue(
      new Error("No encontrado"),
    );

    const store = configureStore({ reducer: { products: productReducer } });
    await store.dispatch(fetchProductById("1") as any);

    const state = store.getState().products;
    expect(state.error).toBe("No encontrado");
  });

  // Reducer tests for individual actions
  test("debe manejar fetchProducts.pending", () => {
    const action = { type: fetchProducts.pending.type };
    const nextState = productReducer(initialState, action);
    expect(nextState.loading).toBe(true);
  });
});
