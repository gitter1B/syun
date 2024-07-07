"use server";
import { Store } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export const getAllStores = async (
  sheets: sheets_v4.Sheets
): Promise<Store[]> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "店舗",
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
