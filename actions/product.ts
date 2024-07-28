"use server";

import { Product, Shipment } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export const getAllProducts = async (
  sheets: sheets_v4.Sheets
): Promise<Product[]> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "商品",
    });

    const data = response.data.values;
    return data
      ? data.slice(1).map((row) => {
          return {
            id: row[0],
            name: row[1],
          };
        })
      : [];
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};

export const getRecentSortedProducts = async (
  shipments: Shipment[],
  products: Product[]
): Promise<Product[]> => {
  const recentProductIds: string[] = [
    ...new Set(
      shipments
        .toSorted(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .map((item) => item.productId)
    ),
  ].slice(0, 9);

  const recentProducts: Product[] = recentProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined) as Product[];

  const restProducts: Product[] = products.filter(
    (product) => !recentProductIds.includes(product.id)
  );
  const sortedProducts: Product[] = [...recentProducts, ...restProducts];

  return sortedProducts;
};
