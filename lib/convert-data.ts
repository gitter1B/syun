import { Product, Store } from "./types";

export const convertProducts = async (
  values: string[][] | null | undefined
): Promise<Product[]> => {
  return values
    ? values.slice(1).map((row) => {
        return {
          id: row[0],
          name: row[1],
        };
      })
    : [];
};

export const convertStores = async (
  values: string[][] | null | undefined
): Promise<Store[]> => {
  return values
    ? values.slice(1).map((row) => {
        return {
          id: row[0],
          name: row[1],
        };
      })
    : [];
};
