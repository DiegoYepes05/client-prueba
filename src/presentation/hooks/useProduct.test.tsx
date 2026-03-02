import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useProduct } from "./useProduct";
import productReducer from "../../infrastructure/state/slices/productSlice";

const mockStore = (initialState?: any) =>
  configureStore({
    reducer: { products: productReducer },
    preloadedState: { products: initialState },
  });

describe("useProduct hook", () => {
  test("debe retornar productos del estado", () => {
    const products = [{ id: "1", name: "P1" }];
    const store = mockStore({
      products,
      loading: false,
      error: null,
      currentProduct: null,
    });

    const { result } = renderHook(() => useProduct(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.products).toEqual(products);
  });

  test("debe retornar producto por ID", () => {
    const product = { id: "1", name: "P1" };
    const store = mockStore({
      products: [],
      loading: false,
      error: null,
      currentProduct: product,
    });

    const { result } = renderHook(() => useProduct("1"), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.product).toEqual(product);
  });
});
