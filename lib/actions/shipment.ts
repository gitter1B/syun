"use server";

import { Shipment, Tables } from "@/lib/types";
import { ShipmentSchema } from "@/schemas";
import { sheets_v4 } from "googleapis";
import { z } from "zod";
import {
  appendValues,
  getSheets,
  getTables,
  rowDelete,
  rowUpdate,
} from "@/lib/sheet";
import { convertShipments } from "@/lib/convert-data";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const createShipment = async (
  values: z.infer<typeof ShipmentSchema>,
  date: string,
  storeId: string
): Promise<{ status: string; message: string }> => {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "認証エラー" };
  }
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    return { status: "error", message: "スプレッドシートIDがありません。" };
  }
  const tables: Tables = await getTables(["出荷"]);
  const shipments: Shipment[] = await convertShipments(tables["出荷"].data);
  const newId: number =
    Math.max(...shipments.map((item) => Number(item.id))) + 1;

  const validatedFields = ShipmentSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      status: "error",
      message: "入力の形式が正しくありません。もう一度入力してください。",
    };
  }
  try {
    const session = await auth();
    if (!session) {
      return { status: "error", message: "認証エラー" };
    }
    const { product: productId, unitPrice, quantity } = values;

    const newValues: string[][] = [
      [newId.toString(), date, productId, unitPrice, quantity, storeId],
    ];

    await appendValues(sheets, spreadsheetId, "出荷", newValues);
    return { status: "success", message: "登録に成功しました。" };
  } catch (error) {
    return { status: "error", message: "エラー" };
  } finally {
    revalidatePath("/shipment");
  }
};

export const updateShipment = async (
  values: z.infer<typeof ShipmentSchema>,
  shipmentId: string,
  date: string,
  storeId: string
): Promise<{ status: string; message: string }> => {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "認証エラー" };
  }
  const validatedFields = ShipmentSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      status: "error",
      message: "入力の形式が正しくありません。もう一度入力してください。",
    };
  }

  try {
    const { product: productId, unitPrice, quantity } = values;
    const sheets: sheets_v4.Sheets = await getSheets();
    const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return { status: "error", message: "スプレッドシートIDがありません。" };
    }
    const tables: Tables = await getTables(["出荷"]);
    const shipments: Shipment[] = await convertShipments(tables["出荷"].data);

    let rowNumber: number = 0;
    for (let i = 0; i < shipments.length; i++) {
      if (shipments[i].id === shipmentId) {
        rowNumber = i + 2;
      }
    }

    const updateValues: string[][] = [
      [
        shipmentId,
        date,
        productId,
        unitPrice.toString(),
        quantity.toString(),
        storeId,
      ],
    ];

    await rowUpdate(sheets, spreadsheetId, "出荷", rowNumber, updateValues);
  } catch (error) {
    console.error(error);
    return { status: "error", message: "変更されませんでした。" };
  } finally {
    revalidatePath("/shipment");
    return { status: "success", message: "変更されました。" };
  }
};

export const deleteShipment = async (
  shipmentId: string
): Promise<{ status: string; message: string }> => {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "認証エラー" };
  }
  try {
    const session = await auth();
    if (!session) {
      return { status: "error", message: "認証エラー" };
    }
    const sheets: sheets_v4.Sheets = await getSheets();
    const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return { status: "error", message: "スプレッドシートIDがありません。" };
    }
    const tables: Tables = await getTables(["出荷"]);
    const shipments: Shipment[] = await convertShipments(tables["出荷"].data);

    let rowNumber: number = 0;
    for (let i = 0; i < shipments.length; i++) {
      if (shipments[i].id === shipmentId) {
        rowNumber = i + 2;
      }
    }

    await rowDelete(sheets, spreadsheetId, "出荷", rowNumber);
  } catch (error) {
    console.error(error);
    return { status: "error", message: "削除できませんでした。" };
  } finally {
    revalidatePath("/shipment");
    return { status: "success", message: "削除しました。" };
  }
};
