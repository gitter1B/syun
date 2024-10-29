import "server-only";

import { cache } from "react";
import { Store } from "@/features/stores/lib/types";
import { Product } from "@/features/products/lib/types";
import { Waste, WasteFilters } from "@/features/wastes/lib/types";

import { getAllStores } from "@/features/stores/lib/data";
import { getAllProducts } from "@/features/products/lib/data";
import { getAllWastes } from "@/features/wastes/lib/data";

export const fetchWasteFilters = cache(
  async (): Promise<{
    stores: Store[];
    products: Product[];
  }> => {
    const products: Product[] = await getAllProducts();
    const stores: Store[] = await getAllStores();

    return {
      stores,
      products,
    };
  }
);

export const fetchWasteList = async (
  filters?: WasteFilters
): Promise<{ wastes: Waste[] }> => {
  const wastes: Waste[] = await getAllWastes();
  const products: Product[] = await getAllProducts();
  const stores: Store[] = await getAllStores();

  const resultWastes: Waste[] = wastes
    .filter((item) => {
      let producerCondition: boolean = true;
      if (filters?.producerId) {
        producerCondition = item.producerId === filters.producerId;
      }
      let storeIdCondition: boolean = true;
      if (filters?.storeId) {
        storeIdCondition =
          filters.storeId === "all" ? true : item.storeId === filters.storeId;
      }
      let productIdCondition: boolean = true;
      if (filters?.productId) {
        productIdCondition =
          filters.productId === "all"
            ? true
            : item.productId === filters.productId;
      }
      return producerCondition && storeIdCondition && productIdCondition;
    })
    .map((item) => {
      const store: Store | undefined = stores.find(
        (s) => s.id === item.storeId
      );
      const product: Product | undefined = products.find(
        (p) => p.id === item.productId
      );

      return {
        ...item,
        store,
        product,
      };
    })
    .toSorted(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  return { wastes: resultWastes };
};
