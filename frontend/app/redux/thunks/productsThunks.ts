import { AppDispatch } from "../store";
import {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  setCurrentPage,
  setCurrentType,
} from "../slices/productsSlice";

interface FetchProductsParams {
  page?: number;
  type?: string;
}

export const fetchProducts = ({ page = 1, type }: FetchProductsParams) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchProductsRequest());
      const currentType = type || 'all';
      const res = await fetch(`/api/products/get-products/${currentType}/${page}/get-all-products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      dispatch(fetchProductsSuccess(data));
      dispatch(setCurrentType(currentType));
      dispatch(setCurrentPage(page));
    } catch (err: any) {
      dispatch(fetchProductsFailure(err.message));
    }
  };