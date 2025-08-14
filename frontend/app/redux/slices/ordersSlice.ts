import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrdersResponse } from "@/app/types/orders";
import { Price } from "@/app/types/products";

interface OrdersState {
    status: "idle" | "loading" | "succeeded" | "failed";
    isLoading: boolean;
    orders: Order[];
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    error: string | null;
    selectedSidebarOrderId: string | number | null;
    selectedModalOrderId: string | number | null;
    productDeleteLoading: boolean;
}

const initialState: OrdersState = {
    status: "idle",
    isLoading: false,
    orders: [],
    currentPage: 1,
    totalPages: 0,
    totalOrders: 0,
    error: null,
    selectedSidebarOrderId: null,
    selectedModalOrderId: null,
    productDeleteLoading: false,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        fetchOrdersRequest(state) {
            state.status = "loading";
            state.isLoading = true;
            state.error = null;
        },
        fetchOrdersSuccess(state, action: PayloadAction<OrdersResponse>) {
            state.status = "succeeded";
            state.isLoading = false;
            state.orders = action.payload.orders;
            state.currentPage = action.payload.page;
            state.totalOrders = action.payload.totalOrders;
            state.totalPages = action.payload.totalPages;
            state.error = null;
        },
        fetchOrdersFailure(state, action: PayloadAction<string>) {
            state.status = "failed";
            state.isLoading = false;
            state.error = action.payload;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        deleteProductRequest(state) {
            state.productDeleteLoading = true;
            state.error = null;
        },
        deleteProductSuccess(
            state,
            action: PayloadAction<{ orderId: number; productId: number; productPrices: Price[] }>
        ) {
            state.productDeleteLoading = false;
            const order = state.orders.find((o) => o.id === action.payload.orderId);
            if (order) {
                order.products = order.products.filter((p) => p.id !== action.payload.productId);

                const uahPrice = action.payload.productPrices.find(p => p.symbol === 'UAH')?.value ?? 0;
                const usdPrice = action.payload.productPrices.find(p => p.symbol === 'USD')?.value ?? 0;

                if (order.totalUAH != null) {
                    order.totalUAH -= uahPrice;
                }
                if (order.totalUSD != null) {
                    order.totalUSD -= usdPrice;
                }
            }
        },
        deleteProductFailure(state, action: PayloadAction<string>) {
            state.productDeleteLoading = false;
            state.error = action.payload;
        },
        clearOrders(state) {
            state.orders = [];
            state.currentPage = 1;
            state.totalOrders = 0;
            state.totalPages = 0;
            state.error = null;
            state.status = "idle";
            state.isLoading = false;
        },
        setSelectedSidebarOrderId(state, action: PayloadAction<string | number | null>) {
            state.selectedSidebarOrderId = action.payload;
        },
        clearSelectedSidebarOrderId(state) {
            state.selectedSidebarOrderId = null;
        },
        setSelectedModalOrderId(state, action: PayloadAction<string | number | null>) {
            state.selectedModalOrderId = action.payload;
        },
        clearSelectedModalOrderId(state) {
            state.selectedModalOrderId = null;
        },
    },
});

export const {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    setCurrentPage,
    clearOrders,
    setSelectedSidebarOrderId,
    clearSelectedSidebarOrderId,
    setSelectedModalOrderId,
    clearSelectedModalOrderId,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFailure,
} = ordersSlice.actions;

export default ordersSlice.reducer;