import "server-only";

import { cache } from "react";

import { Stock } from "@/features/stocks/lib/types";

import { getStocks } from "@/features/stocks/lib/data";

export const fetchStockTable = cache(
  async (
    producerId: string
  ): Promise<{
    stocks: Stock[];
    existStoreItems: { storeId: string; storeName: string }[];
  }> => {
    const stocks: Stock[] = await getStocks(producerId);
    const existStoreItems: { storeId: string; storeName: string }[] = stocks
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.storeId === item.storeId)
      )
      .map((item) => ({
        storeId: item.storeId,
        storeName: item.storeName!,
      }))
      .toSorted((a, b) => Number(a.storeId) - Number(b.storeId));
    return {
      stocks,
      existStoreItems,
    };
  }
);
