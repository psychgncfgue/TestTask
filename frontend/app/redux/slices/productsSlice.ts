import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductsResponse } from "@/app/types/products";

interface ProductsState {
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  products: Product[];
  currentPage: number;
  currentType: string;
  totalPages: number;
  totalProducts: number;
  productTypes: string[];
  error: string | null;
}

const initialState: ProductsState = {
  status: "idle",
  isLoading: false,
  products: [],
  currentPage: 1,
  currentType: 'all',
  totalPages: 0,
  totalProducts: 0,
  productTypes: [],
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsRequest(state) {
      state.status = "loading";
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action: PayloadAction<ProductsResponse>) {
      state.status = "succeeded";
      state.isLoading = false;
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalProducts = action.payload.totalProducts;
      state.productTypes = action.payload.productTypes;
      state.error = null;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setCurrentType(state, action: PayloadAction<string>) {
      state.currentType = action.payload;
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  setCurrentPage,
  setCurrentType,
} = productsSlice.actions;

export default productsSlice.reducer;