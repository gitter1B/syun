"use server";

import { convertSales } from "@/lib/convert-data";
import { appendValues, getSheets, getTables } from "@/lib/sheet";
import { Sales, Tables } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export const testAction = async () => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  const sheets: sheets_v4.Sheets = await getSheets();
  const tables: Tables = await getTables(["sales"]);
  const salesData: Sales[] = await convertSales(tables["sales"].data);
  const newHeader: string[] = [
    "ID",
    "日付",
    "商品ID",
    "単価",
    "数量",
    "合計",
    "店舗ID",
  ];
  const newData: string[][] = salesData.map(
    ({ id, date, productId, unitPrice, quantity, storeId }) => {
      const total: number = unitPrice * quantity;
      return [
        id,
        date,
        productId,
        unitPrice.toString(),
        quantity.toString(),
        total.toString(),
        storeId,
      ];
    }
  );
  const newTable: string[][] = [newHeader, ...newData];

  // await appendValues(sheets, spreadsheetId, "test", newTable);
};
