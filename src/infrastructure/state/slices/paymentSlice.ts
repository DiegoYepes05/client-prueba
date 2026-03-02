import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  PaymentStatus,
  TransactionDetail,
} from "../../../domain/entities/Transaction";
import {
  getPaymentsStatusUseCase,
  getTransactionDetailUseCase,
} from "../../di/container";

interface PaymentState {
  payments: PaymentStatus[];
  currentTransaction: TransactionDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentTransaction: null,
  loading: false,
  error: null,
};

export const fetchPaymentsStatus = createAsyncThunk(
  "payments/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await getPaymentsStatusUseCase.execute();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTransactionDetail = createAsyncThunk(
  "payments/fetchDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getTransactionDetailUseCase.execute(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentsStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaymentsStatus.fulfilled,
        (state, action: PayloadAction<PaymentStatus[]>) => {
          state.loading = false;
          state.payments = action.payload;
        },
      )
      .addCase(fetchPaymentsStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactionDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactionDetail.fulfilled,
        (state, action: PayloadAction<TransactionDetail>) => {
          state.loading = false;
          state.currentTransaction = action.payload;
        },
      )
      .addCase(fetchTransactionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTransaction } = paymentSlice.actions;
export default paymentSlice.reducer;
