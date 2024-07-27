// "use server";

// import { getAllStores } from "@/actions/store";
// import { getAllWastes } from "@/actions/waste";
// import { appendValues, getSheets } from "@/lib/sheet";
// import { Sales, Shipment, Store, Waste } from "@/lib/types";
// import { sheets_v4 } from "googleapis";

// export type P = {
//   id: string;
//   productName: string;
//   code: string;
// };

// export type CopyWaste = {
//   id: string;
//   date: string;
//   storeId: string;
//   productId: string;
//   unitPrice: number;
//   quantity: number;
// };

// export type CopyShipment = {
//   date: string;
//   productId: string;
//   unitPrice: number;
//   quantity: number;
//   storeId: string;
// };

// export type CopySales = {
//   date: string;
//   productName: string;
//   unitPrice: number;
//   quantity: number;
//   storeName: string;
// };

// export const getAllP = async (sheets: sheets_v4.Sheets): Promise<P[]> => {
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

//   if (!spreadsheetId) {
//     console.error("Spreadsheet ID is undefined");
//     return [];
//   }

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: "商品 のコピー",
//     });

//     const data = response.data.values;
//     const salesData: P[] = data
//       ? data.slice(1).map((row) => {
//           return {
//             id: row[0],
//             productName: row[1],
//             code: row[2],
//           };
//         })
//       : [];

//     return salesData;
//   } catch (error: unknown) {
//     console.error((error as Error).message);
//     return [];
//   }
// };

// export const getCopyWastes = async (
//   sheets: sheets_v4.Sheets
// ): Promise<CopyWaste[]> => {
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

//   if (!spreadsheetId) {
//     console.error("Spreadsheet ID is undefined");
//     return [];
//   }

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: "廃棄コピー",
//     });

//     const data = response.data.values;
//     const copyWastes: CopyWaste[] = data
//       ? data.slice(1).map((row) => {
//           return {
//             id: row[0],
//             date: row[1],
//             storeId: row[2],
//             productId: row[3],
//             unitPrice: Number(row[4]),
//             quantity: Number(row[5]),
//           };
//         })
//       : [];

//     return copyWastes;
//   } catch (error: unknown) {
//     console.error((error as Error).message);
//     return [];
//   }
// };

// export const getCopyShipments = async (
//   sheets: sheets_v4.Sheets
// ): Promise<CopyShipment[]> => {
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

//   if (!spreadsheetId) {
//     console.error("Spreadsheet ID is undefined");
//     return [];
//   }

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: "出荷コピー",
//     });

//     const data = response.data.values;
//     const copyShipments: CopyShipment[] = data
//       ? data.slice(1).map((row) => {
//           return {
//             date: row[0],
//             productId: row[1],
//             unitPrice: Number(row[2]),
//             quantity: Number(row[3]),
//             storeId: row[4],
//           };
//         })
//       : [];

//     return copyShipments;
//   } catch (error: unknown) {
//     console.error((error as Error).message);
//     return [];
//   }
// };

// export const getCopySales = async (
//   sheets: sheets_v4.Sheets
// ): Promise<CopySales[]> => {
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

//   if (!spreadsheetId) {
//     console.error("Spreadsheet ID is undefined");
//     return [];
//   }

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: "販売コピー",
//     });

//     const data = response.data.values;
//     const copyShipments: CopySales[] = data
//       ? data.slice(1).map((row) => {
//           return {
//             date: row[0],
//             productName: row[1],
//             unitPrice: Number(row[2]),
//             quantity: Number(row[3]),
//             storeName: row[4],
//           };
//         })
//       : [];

//     return copyShipments;
//   } catch (error: unknown) {
//     console.error((error as Error).message);
//     return [];
//   }
// };

// export const convertWastes = async () => {
//   const sheets: sheets_v4.Sheets = await getSheets();
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
//   const copyWastes: CopyWaste[] = await getCopyWastes(sheets);
//   const ps: P[] = await getAllP(sheets);

//   const newWastes: Waste[] = copyWastes.map((item) => {
//     const code: string = ps.find((p) => p.id === item.productId)?.code || "";
//     return {
//       ...item,
//       productId: code,
//     };
//   });
//   const values: string[][] = newWastes.map(
//     ({ id, date, storeId, unitPrice, quantity, productId }) => {
//       return [
//         id,
//         date,
//         productId,
//         unitPrice.toString(),
//         quantity.toString(),
//         storeId,
//       ];
//     }
//   );
//   await appendValues(sheets, spreadsheetId, "廃棄", values);
//   return newWastes;
// };

// export const convertShipments = async () => {
//   const sheets: sheets_v4.Sheets = await getSheets();
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
//   const copyShipments: CopyShipment[] = await getCopyShipments(sheets);
//   const ps: P[] = await getAllP(sheets);

//   const newShipments: Shipment[] = copyShipments.map((item, index) => {
//     const code: string = ps.find((p) => p.id === item.productId)?.code || "";
//     return {
//       id: (index + 1).toString(),
//       ...item,
//       productId: code,
//     };
//   });
//   const values: string[][] = newShipments.map(
//     ({ id, date, storeId, unitPrice, quantity, productId }) => {
//       return [
//         id,
//         date,
//         productId,
//         unitPrice.toString(),
//         quantity.toString(),
//         storeId,
//       ];
//     }
//   );
//   await appendValues(sheets, spreadsheetId, "出荷", values);
//   return newShipments;
// };

// export const convertSales = async () => {
//   const sheets: sheets_v4.Sheets = await getSheets();
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
//   const copySales: CopySales[] = await getCopySales(sheets);
//   const ps: P[] = await getAllP(sheets);
//   const stores: Store[] = await getAllStores(sheets);

//   const newSalesData: Sales[] = copySales.map((item, index) => {
//     const code: string =
//       ps.find((p) => p.productName === item.productName)?.code || "";
//     const storeId: string =
//       stores.find((s) => s.name === item.storeName)?.id || "";
//     return {
//       id: (index + 1).toString(),
//       ...item,
//       productId: code,
//       storeId: storeId,
//     };
//   });
//   const values: string[][] = newSalesData.map(
//     ({ id, date, storeId, unitPrice, quantity, productId }) => {
//       return [
//         id,
//         date,
//         productId,
//         unitPrice.toString(),
//         quantity.toString(),
//         storeId,
//       ];
//     }
//   );
//   await appendValues(sheets, spreadsheetId, "販売", values);
//   return newSalesData;
// };
