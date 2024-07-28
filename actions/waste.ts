"use server";
import { appendValues, getSheets, rowDelete, rowUpdate } from "@/lib/sheet";
import { Product, Stock, Store, Waste, WasteItem } from "@/lib/types";
import { WasteSchema } from "@/schemas";
import { format } from "date-fns-tz";
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
  productId: string | undefined,
  storeId: string | undefined
): Promise<WasteItem[]> => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetId,
      ranges: ["商品", "店舗", "廃棄"],
    });

    const data: sheets_v4.Schema$ValueRange[] | undefined =
      response.data.valueRanges;
    if (!data) {
      return [];
    }

    const products: Product[] = data[0].values
      ? data[0].values.slice(1).map((row) => {
          return {
            id: row[0],
            name: row[1],
          };
        })
      : [];

    const stores: Store[] = data[1].values
      ? data[1].values.slice(1).map((row) => {
          return {
            id: row[0],
            name: row[1],
          };
        })
      : [];

    const wastes: WasteItem[] = data[2].values
      ? data[2].values
          .slice(1)
          .filter((row) => {
            const productCondition: boolean =
              productId === "all" ? true : row[2] === productId;
            const storeCondition: boolean =
              storeId === "all" ? true : row[5] === storeId;
            return productCondition && storeCondition;
          })
          .map((row) => {
            const product: Product = products.find((p) => p.id === row[2])!;
            const store: Store = stores.find((s) => s.id === row[5])!;

            return {
              id: row[0],
              date: row[1],
              productId: row[2],
              unitPrice: Number(row[3]),
              quantity: Number(row[4]),
              storeId: row[5],
              productName: product.name,
              storeName: store.name,
            };
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
      : [];
    return wastes;
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
      format(date, "yyyy-MM-dd", {
        timeZone: "Asia/Tokyo",
      }),
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
