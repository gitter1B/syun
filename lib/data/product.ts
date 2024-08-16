import { Product, Tables } from "@/lib/types";
import { getTables } from "@/lib/sheet";
import { convertStores } from "@/lib/convert-data";

export const getProducts = async (): Promise<Product[]> => {
  const tables: Tables = await getTables(["商品"]);
  const products: Product[] = await convertStores(tables["商品"].data);
  return products;
};
