export interface Price {
  value: number;
  symbol: string;
  isDefault: boolean;
}

export interface Guarantee {
  start: string;
  end: string;
}

export interface Product {
  id: number;
  serialNumber: number;
  isNew: boolean;
  photo: string;
  title: string;
  type: string;
  specification: string;
  guarantee: Guarantee;
  price: Price[];
  order: number | null;
  date: string;
}

export interface ProductsResponse {
  currentPage: number;
  totalPages: number; 
  totalProducts: number; 
  productTypes: string[]; 
  products: Product[];
}