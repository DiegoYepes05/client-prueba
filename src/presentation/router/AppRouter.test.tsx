import { render, screen } from "@testing-library/react";
import { AppRouter } from "./AppRouter";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../../infrastructure/state/slices/productSlice";
import orderReducer from "../../infrastructure/state/slices/orderSlice";
import paymentReducer from "../../infrastructure/state/slices/paymentSlice";
import { useProduct } from "../hooks/useProduct";

// Mock constant matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

jest.mock("../hooks/useProduct");
const mockUseProduct = useProduct as jest.Mock;

describe("AppRouter", () => {
  test("debe renderizar la página principal", () => {
    mockUseProduct.mockReturnValue({
      products: [
        {
          id: "1",
          name: "Producto Mock",
          price: 1000,
          imageUrl: "",
          stock: 10,
        },
      ],
      loading: false,
      error: null,
    });

    const store = configureStore({
      reducer: {
        products: productReducer,
        order: orderReducer,
        payments: paymentReducer,
      },
    });

    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>,
    );

    expect(screen.getByText(/colección/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock/i)).toBeInTheDocument();
  });
});
