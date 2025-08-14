import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import productsReducer from "./slices/productsSlice";
import ordersReducer from './slices/ordersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  products: productsReducer,
  orders: ordersReducer,
});

export default rootReducer;