"use server";

import { appendValues, getSheets } from "@/lib/sheet";
import { sheets_v4 } from "googleapis";
import { Product, Sales, Store } from "@/lib/types";
import { getAllProducts } from "@/actions/product";
import { getAllSales } from "@/actions/sales";
import { getAllStores } from "@/actions/store";

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

export const createSales = async (): Promise<{ message: string }> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    return { message: "error" };
  }
  const sheets: sheets_v4.Sheets = await getSheets();
  const products: Product[] = await getAllProducts(sheets);
  const stores: Store[] = await getAllStores(sheets);
  const salesData: Sales[] = await getAllSales(sheets);
  const setData: string[] = [
    ...new Set(salesData.map(({ id, ...rest }) => JSON.stringify(rest))),
  ];
  const parseData: Sales[] = setData.map((item, index) => {
    return {
      id: (index + 1).toString(),
      ...JSON.parse(item),
    };
  });

  // let count: number = 0;
  // for (let i: number = 0; i < salesData.length; i++) {
  //   const { id: iId, ...iRest } = salesData[i];
  //   for (let j: number = i + 1; j < salesData.length; j++) {
  //     const { id: jId, ...jRest } = salesData[j];
  //     if (JSON.stringify(iRest) === JSON.stringify(jRest)) {
  //       // console.log(iId, iRest, jId, jRest);
  //       count++;
  //       break;
  //     }
  //   }
  // }

  // console.log(count);

  // const salesValues: string[][] = parseData.map((item) => {
  //   const productId: string =
  //     products.find((p) => p.name === item.productName)?.id || "";
  //   const storeId: string =
  //     stores.find((s) => s.name === item.storeName)?.id || "";

  //   return [
  //     item.id,
  //     item.date,
  //     productId,
  //     item.unitPrice.toString(),
  //     item.quantity.toString(),
  //     storeId,
  //   ];
  // });
  return { message: "success" };
};
