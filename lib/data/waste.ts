import { Product, Store, Tables, Waste, WasteFilters } from "@/lib/types";
import { getTables } from "@/lib/sheet";
import {
  convertProducts,
  convertStores,
  convertWastes,
} from "@/lib/convert-data";

export const fetchWasteFilters = async (): Promise<{
  stores: Store[];
  products: Product[];
}> => {
  const tables: Tables = await getTables(["店舗", "商品"]);
  const stores: Store[] = await convertStores(tables["店舗"].data);
  const products: Product[] = await convertStores(tables["商品"].data);
  return {
    stores,
    products,
  };
};

export const fetchWasteList = async (
  filters?: WasteFilters
): Promise<{ wastes: Waste[] }> => {
  const tables: Tables = await getTables(["商品", "店舗", "廃棄"]);
  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertStores(tables["店舗"].data);
  const wastes: Waste[] = await convertWastes(tables["廃棄"].data);

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
