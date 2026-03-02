import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    order: orderReducer,
    payments: paymentReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
