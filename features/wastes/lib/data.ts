import "server-only";

import { cache } from "react";

import { Product } from "@/features/products/lib/types";
import { Store } from "@/features/stores/lib/types";
import { Waste, WasteFilters } from "@/features/wastes/lib/types";

import { getTable } from "@/lib/sheet";
import { getAllProducts } from "@/features/products/lib/data";
import { getAllStores } from "@/features/stores/lib/data";

export const getAllWastes = cache(async (): Promise<Waste[]> => {
  const data: string[][] = await getTable("廃棄");
  const products: Product[] = await getAllProducts();
  const stores: Store[] = await getAllStores();

  return data
    ? data.slice(1).map((row) => {
        const productId: string = row[3];
        const storeId: string = row[6];
        const product: Product | undefined = products.find(
          (p) => p.id === productId
        );
        const store: Store | undefined = stores.find((s) => s.id === storeId);
        return {
          id: row[0],
          producerId: row[1],
          date: row[2],
          productId,
          unitPrice: Number(row[4]),
          quantity: Number(row[5]),
          storeId,
          product,
          store,
        };
      })
    : [];
});

export const getWastes = cache(
  async (filters: WasteFilters): Promise<Waste[]> => {
    const wastes: Waste[] = await getAllWastes();
    const filteredWastes: Waste[] = wastes.filter((item) => {
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
    });
    return filteredWastes;
  }
);
