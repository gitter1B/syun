import { Product } from "@/features/products/lib/types";
import { Store } from "@/features/stores/lib/types";

export type Sales = {
  id: string;
  producerId: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  storeId: string;
  product?: Product;
  store?: Store;
};

export type SalesFilters = {
  producerId?: string;
  storeId?: string;
  productId?: string;
  from?: string;
  to?: string;
};

export type TotalSales = {
  product: Product;
  totalQuantity: number;
  totalPrice: number;
  details: {
    unitPrice: number;
    totalQuantity: number;
    totalPrice: number;
  }[];
};

export type SyunSales = {
  producerId: string;
  date: string;
  storeName: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};
