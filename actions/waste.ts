"use server";
import {
  convertProducts,
  convertStores,
  convertWastes,
} from "@/lib/convert-data";
import {
  appendValues,
  getSheets,
  getTables,
  rowDelete,
  rowUpdate,
} from "@/lib/sheet";
import { Product, Stock, Store, Tables, Waste } from "@/lib/types";
import { WasteSchema } from "@/schemas";
import { formatInTimeZone } from "date-fns-tz";
import { sheets_v4 } from "googleapis";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export const getWastes = async (
  productId?: string,
  storeId?: string
): Promise<Waste[]> => {
  const tables: Tables = await getTables(["商品", "店舗", "廃棄"]);
  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertStores(tables["店舗"].data);
  const wastes: Waste[] = await convertWastes(tables["廃棄"].data);

  let filteredWastes: Waste[] = wastes;

  if (productId) {
    filteredWastes = filteredWastes.filter((item) =>
      productId === "all" ? true : item.productId === productId
    );
  }

  if (storeId) {
    filteredWastes = filteredWastes.filter((item) =>
      storeId === "all" ? true : item.storeId === storeId
    );
  }

  const resultWastes: Waste[] = filteredWastes
    .map((item) => {
      const productName: string =
        products.find((p) => p.id === item.productId)?.name || "";
      const storeName: string =
        stores.find((s) => s.id === item.storeId)?.name || "";

      return {
        ...item,
        productName,
        storeName,
      };
    })
    .toSorted(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  return resultWastes;
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
  revalidatePath("/waste");
};

export const updateWaste = async (
  values: z.infer<typeof WasteSchema>,
  wasteId: string
) => {
  const validatedFields = WasteSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      message: "入力の形式が正しくありません。もう一度入力してください。",
    };
  }

  const { date, quantity } = values;
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  const wastes: Waste[] = await getAllWastes(sheets);
  const waste: Waste | undefined = wastes.find((item) => item.id === wasteId);
  let rowNumber: number = 0;
  for (let i = 0; i < wastes.length; i++) {
    if (wastes[i].id === wasteId) {
      rowNumber = i + 2;
    }
  }
  if (!waste) {
    return {
      message: "データが存在しません。",
    };
  }
  const updateValues: string[][] = [
    [
      wasteId,
      formatInTimeZone(date, "Asia/Tokyo", "yyyy-MM-dd"),
      waste.productId,
      waste.unitPrice.toString(),
      quantity.toString(),
      waste.storeId,
    ],
  ];

  if (spreadsheetId) {
    await rowUpdate(sheets, spreadsheetId, "廃棄", rowNumber, updateValues);
    revalidatePath("/waste");
    revalidatePath("/stock");
  }
};

export const deleteWaste = async (wasteId: string) => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  const shipments: Waste[] = await getAllWastes(sheets);
  let rowNumber: number = 0;
  for (let i = 0; i < shipments.length; i++) {
    if (shipments[i].id === wasteId) {
      rowNumber = i + 2;
    }
  }
  if (spreadsheetId) {
    await rowDelete(sheets, spreadsheetId, "廃棄", rowNumber);
    revalidatePath("/stock");
    revalidatePath("/waste");
  }
};
