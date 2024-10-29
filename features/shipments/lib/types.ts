import { Product } from "@/features/products/lib/types";
import { Store } from "@/features/stores/lib/types";

export type Shipment = {
  id: string;
  producerId: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
  product?: Product;
  store?: Store;
};

export type ShipmentFilters = {
  producerId?: string;
  storeId?: string;
  date?: string;
};
