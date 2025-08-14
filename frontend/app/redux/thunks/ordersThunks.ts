import { AppDispatch } from "../store";
import {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  setCurrentPage,
  deleteProductSuccess,
  deleteProductRequest,
  deleteProductFailure,
} from "../slices/ordersSlice";
import { ordersFetchLimit } from "@/app/constants/fetchLimits";
import { Price } from "@/app/types/products";

interface FetchOrdersParams {
  page?: number;
}

export const fetchOrders = ({ page = 1 }: FetchOrdersParams) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchOrdersRequest());

      const res = await fetch(`/api/orders?page=${page}&limit=${ordersFetchLimit}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
      const data = await res.json();

      dispatch(fetchOrdersSuccess(data));
      dispatch(setCurrentPage(page));
    } catch (err: any) {
      dispatch(fetchOrdersFailure(err.message));
    }
  };

export const deleteProductFromOrder =
  (orderId: number, productId: number, productPrices: Price[]) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteProductRequest());

      const res = await fetch(`/api/orders/${orderId}/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
      await res.json();

      dispatch(deleteProductSuccess({ orderId, productId, productPrices }));

    } catch (err: any) {
      dispatch(deleteProductFailure(err.message));
    }
  };
