import "server-only";

import { cache } from "react";
import { getTable } from "@/lib/sheet";
import { Store } from "@/features/stores/lib/types";

export const getAllStores = cache(async (): Promise<Store[]> => {
  const data: string[][] = await getTable("店舗");
  return data
    ? data.slice(1).map((row) => {
        return {
          id: row[0],
          name: row[1],
        };
      })
    : [];
});
