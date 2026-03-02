import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../infrastructure/state/store";
import {
  fetchProducts,
  fetchProductById,
  clearCurrentProduct,
} from "../../infrastructure/state/slices/productSlice";

export function useProduct(productId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, currentProduct, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    } else {
      dispatch(fetchProducts());
    }

    return () => {
      if (productId) {
        dispatch(clearCurrentProduct());
      }
    };
  }, [productId, dispatch]);

  return { product: currentProduct, products, loading, error };
}
