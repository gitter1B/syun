"use server";

import { appendValues, getSheets, rowDelete, rowUpdate } from "@/lib/sheet";
import { Product, Shipment, Store } from "@/lib/types";
import { ShipmentSchema } from "@/schemas";
import { sheets_v4 } from "googleapis";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getAllShipments = async (
  sheets: sheets_v4.Sheets
): Promise<Shipment[]> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "出荷",
    });

    const data = response.data.values;
    const shipments: Shipment[] = data
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

    return shipments;
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};

export const addShipment = async (
  values: z.infer<typeof ShipmentSchema>,
  date: string,
  storeId: string
) => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  const shipments: Shipment[] = await getAllShipments(sheets);
  const newId: number =
    Math.max(...shipments.map((item) => Number(item.id))) + 1;

  const validatedFields = ShipmentSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      message: "入力の形式が正しくありません。もう一度入力してください。",
    };
  }
  const { product: productId, unitPrice, quantity } = values;

  const newValues: string[][] = [
    [newId.toString(), date, productId, unitPrice, quantity, storeId],
  ];

  await appendValues(sheets, spreadsheetId, "出荷", newValues);
  revalidatePath("/shipment");
};

export const updateShipment = async (
  values: z.infer<typeof ShipmentSchema>,
  shipmentId: string,
  date: string,
  storeId: string
): Promise<{ status: string; message: string }> => {
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
    const shipments: Shipment[] = await getAllShipments(sheets);
    let rowNumber: number = 0;
    for (let i = 0; i < shipments.length; i++) {
      if (shipments[i].id === shipmentId) {
        rowNumber = i + 2;
      }
    }

    const updateValues: string[][] = [
      [
        shipmentId.toString(),
        date,
        productId,
        unitPrice.toString(),
        quantity.toString(),
        storeId,
      ],
    ];
    if (!spreadsheetId) {
      return { status: "error", message: "変更されませんでした。" };
    }
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
  try {
    const sheets: sheets_v4.Sheets = await getSheets();
    const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
    const shipments: Shipment[] = await getAllShipments(sheets);
    let rowNumber: number = 0;
    for (let i = 0; i < shipments.length; i++) {
      if (shipments[i].id === shipmentId) {
        rowNumber = i + 2;
      }
    }

    if (!spreadsheetId) {
      return { status: "error", message: "削除できませんでした。" };
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
