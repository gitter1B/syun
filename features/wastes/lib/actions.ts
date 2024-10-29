"use server";

import { WasteSchema } from "@/lib/schemas";
import { formatInTimeZone } from "date-fns-tz";
import { sheets_v4 } from "googleapis";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

import { appendValues, getSheets, rowDelete, rowUpdate } from "@/lib/sheet";

import { Producer } from "@/features/producers/lib/types";
import { Stock } from "@/features/stocks/lib/types";
import { Waste } from "@/features/wastes/lib/types";

import { getAllWastes } from "@/features/wastes/lib/data";
import { getAllProducers } from "@/features/producers/lib/data";

export const createWaste = async (
  producerId: string,
  date: string,
  quantity: string,
  stock: Stock
) => {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "認証エラー" };
  }
  const producers: Producer[] = await getAllProducers();
  const wastes: Waste[] = await getAllWastes();
  if (!producers.find((producer) => producer.id === producerId)) {
    return {
      status: "error",
      message: "生産者がいません。",
    };
  }
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    return { status: "error", message: "スプレッドシートIDがありません。" };
  }
  const newId: string = (
    Math.max(...wastes.map((item) => Number(item.id))) + 1
  ).toString();

  const newValues: string[][] = [
    [
      newId,
      producerId,
      date,
      stock.productId,
      stock.unitPrice.toString(),
      quantity,
      stock.storeId,
    ],
  ];

  try {
    await appendValues("廃棄", newValues);
  } catch (error: any) {
    return { status: "error", message: "廃棄登録に失敗しました。" };
  } finally {
    revalidatePath("/stock");
    revalidatePath("/waste");
  }
};

export const updateWaste = async (
  values: z.infer<typeof WasteSchema>,
  wasteId: string
) => {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "認証エラー" };
  }
  const validatedFields = WasteSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      message: "入力の形式が正しくありません。もう一度入力してください。",
    };
  }

  const { date, quantity } = values;
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    return { status: "error", message: "スプレッドシートIDがありません。" };
  }
  const wastes: Waste[] = await getAllWastes();
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
      waste.producerId,
      formatInTimeZone(date, "Asia/Tokyo", "yyyy-MM-dd"),
      waste.productId,
      waste.unitPrice.toString(),
      quantity.toString(),
      waste.storeId,
    ],
  ];

  try {
    await rowUpdate(sheets, spreadsheetId, "廃棄", rowNumber, updateValues);
  } catch (error: any) {
    return { status: "error", message: "廃棄更新に失敗しました。" };
  } finally {
    revalidatePath("/stock");
    revalidatePath("/waste");
  }
};

export const deleteWaste = async (wasteId: string) => {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "認証エラー" };
  }
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    return { status: "error", message: "スプレッドシートIDがありません。" };
  }
  const wastes: Waste[] = await getAllWastes();
  let rowNumber: number = 0;
  for (let i = 0; i < wastes.length; i++) {
    if (wastes[i].id === wasteId) {
      rowNumber = i + 2;
    }
  }
  try {
    await rowDelete(sheets, spreadsheetId, "廃棄", rowNumber);
  } catch (error: any) {
    return { status: "error", message: "廃棄削除に失敗しました。" };
  } finally {
    revalidatePath("/stock");
    revalidatePath("/waste");
  }
};
