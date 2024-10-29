import { Product } from "@/features/products/lib/types";
import { Store } from "@/features/stores/lib/types";

export type Waste = {
  id: string;
  producerId: string;
  date: string;
  storeId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  store?: Store;
  product?: Product;
};

export type WasteFilters = {
  producerId?: string;
  storeId?: string;
  productId?: string;
};
