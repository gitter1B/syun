import { Store, Tables } from "@/lib/types";
import { getTables } from "../sheet";
import { convertStores } from "../convert-data";

export const getStores = async (): Promise<Store[]> => {
  const tables: Tables = await getTables(["店舗"]);
  const stores: Store[] = await convertStores(tables["店舗"].data);

  return stores;
};
