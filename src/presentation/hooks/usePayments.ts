import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../infrastructure/state/store";
import {
  fetchPaymentsStatus,
  fetchTransactionDetail,
  clearCurrentTransaction,
} from "../../infrastructure/state/slices/paymentSlice";

export function usePayments(transactionId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, currentTransaction, loading, error } = useSelector(
    (state: RootState) => state.payments,
  );

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionDetail(transactionId));
    } else {
      dispatch(fetchPaymentsStatus());
    }

    return () => {
      if (transactionId) {
        dispatch(clearCurrentTransaction());
      }
    };
  }, [transactionId, dispatch]);

  return {
    payments,
    transaction: currentTransaction,
    loading,
    error,
    refresh: () => dispatch(fetchPaymentsStatus()),
  };
}
