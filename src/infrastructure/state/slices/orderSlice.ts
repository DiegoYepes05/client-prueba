import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../domain/entities/Product";
import { Order, ShippingInfo } from "../../../domain/entities/Order";
import { CardInfo, Transaction } from "../../../domain/entities/Transaction";
import {
  createOrderUseCase,
  processPaymentUseCase,
  getMerchantUseCase,
} from "../../di/container";
import { Merchant } from "../../../domain/entities/Merchant";
interface OrderState {
  product: Product | null;
  order: Order | null;
  cardInfo: CardInfo | null;
  transaction: Transaction | null;
  merchant: Merchant | null;
  acceptedTerms: boolean;
  acceptedData: boolean;
  loading: boolean;
  error: string | null;
}

const PERSISTENCE_KEY = "wompi_checkout_flow";

const loadPersistedState = (): Partial<OrderState> => {
  try {
    const data = localStorage.getItem(PERSISTENCE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const savePersistedState = (state: OrderState) => {
  try {
    const { product, order, acceptedTerms, acceptedData } = state;
    localStorage.setItem(
      PERSISTENCE_KEY,
      JSON.stringify({ product, order, acceptedTerms, acceptedData }),
    );
  } catch (e) {
    console.error("Error persisting state", e);
  }
};

const persisted = loadPersistedState();

const initialState: OrderState = {
  product: persisted.product ?? null,
  order: persisted.order ?? null,
  cardInfo: persisted.cardInfo ?? null,
  transaction: null,
  merchant: null,
  acceptedTerms: persisted.acceptedTerms ?? false,
  acceptedData: persisted.acceptedData ?? false,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/create",
  async (
    {
      product,
      quantity,
      shippingInfo,
    }: { product: Product; quantity: number; shippingInfo: ShippingInfo },
    { rejectWithValue },
  ) => {
    try {
      return createOrderUseCase.execute(product, quantity, shippingInfo);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const processPayment = createAsyncThunk(
  "order/processPayment",
  async (
    {
      order,
      cardToken,
      acceptanceToken,
    }: { order: Order; cardToken: string; acceptanceToken: string },
    { rejectWithValue },
  ) => {
    try {
      return await processPaymentUseCase.execute(
        order,
        cardToken,
        acceptanceToken,
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const tokenizeCard = createAsyncThunk(
  "order/tokenizeCard",
  async (cardInfo: CardInfo, { rejectWithValue }) => {
    try {
      return await processPaymentUseCase.tokenizeCard(cardInfo);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMerchant = createAsyncThunk(
  "order/fetchMerchant",
  async (_, { rejectWithValue }) => {
    try {
      return await getMerchantUseCase.execute();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
      savePersistedState(state);
    },
    setCardInfo: (state, action: PayloadAction<CardInfo>) => {
      state.cardInfo = action.payload;
      savePersistedState(state);
    },
    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      if (!state.order && state.product) {

        state.order = {
          product: state.product,
          quantity: 1,
          shippingInfo: action.payload,
          subtotal: state.product.price,
          baseFee: 15000,
          shippingFee: 10000,
          totalAmount: state.product.price + 15000 + 10000,
        };
      } else if (state.order) {
        state.order.shippingInfo = action.payload;
      }
      savePersistedState(state);
    },
    setAcceptance: (
      state,
      action: PayloadAction<{ terms: boolean; data: boolean }>,
    ) => {
      state.acceptedTerms = action.payload.terms;
      state.acceptedData = action.payload.data;
      savePersistedState(state);
    },
    resetOrderFlow: (state) => {
      state.product = null;
      state.order = null;
      state.cardInfo = null;
      state.transaction = null;
      state.merchant = null;
      state.acceptedTerms = false;
      state.acceptedData = false;
      state.error = null;
      localStorage.removeItem(PERSISTENCE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
        savePersistedState(state);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        processPayment.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.loading = false;
          state.transaction = action.payload;
        },
      )
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMerchant.fulfilled,
        (state, action: PayloadAction<Merchant>) => {
          state.loading = false;
          state.merchant = action.payload;
        },
      )
      .addCase(fetchMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(tokenizeCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tokenizeCard.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(tokenizeCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProduct,
  setCardInfo,
  setShippingInfo,
  setAcceptance,
  resetOrderFlow,
} = orderSlice.actions;
export default orderSlice.reducer;
