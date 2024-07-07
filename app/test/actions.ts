"use server";

import { appendValues, getSheets } from "@/lib/sheet";
import { sheets_v4 } from "googleapis";

export const getData = async () => {
  const res = await fetch("http://localhost:3000/api/sales", {
    method: "GET",
    cache: "no-store",
  });
  const data = (await res.json()) as string[][];
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId = process.env.SPREADSHEET_ID;

  await appendValues(sheets, spreadsheetId, "商品", data);
};
