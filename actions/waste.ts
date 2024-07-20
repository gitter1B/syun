"use server";
import { appendValues, getSheets } from "@/lib/sheet";
import { Stock, Waste } from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { revalidatePath } from "next/cache";

export const getAllWastes = async (
  sheets: sheets_v4.Sheets
): Promise<Waste[]> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "廃棄",
    });

    const data = response.data.values;
    const wastesData: Waste[] = data
      ? data.slice(1).map((row) => {
          return {
            id: row[0],
            date: row[1],
            productId: row[2],
            unitPrice: Number(row[3]),
            quantity: Number(row[4]),
            storeId: row[5],
          };
        })
      : [];

    return wastesData;
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};

export const addWaste = async (
  date: string,
  quantity: string,
  stock: Stock
) => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const wastes: Waste[] = await getAllWastes(sheets);
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  const newId: string = (
    Math.max(...wastes.map((item) => Number(item.id))) + 1
  ).toString();

  const newValues: string[][] = [
    [
      newId,
      date,
      stock.productId,
      stock.unitPrice.toString(),
      quantity,
      stock.storeId,
    ],
  ];
  await appendValues(sheets, spreadsheetId, "廃棄", newValues);
  revalidatePath("/stock");
};
