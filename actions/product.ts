"use server";

import { Product } from "@/lib/types";
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
