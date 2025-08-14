import { Product } from './products';

export interface Order {
  id: number;
  title: string;
  date: string;
  description: string;
  products: Product[];
  totalUSD?: number; 
  totalUAH?: number;
}

export interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  page: number;  
  limit: number;
  totalPages: number;
}