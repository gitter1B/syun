import "server-only";

import { google, sheets_v4 } from "googleapis";
import { Tables } from "./types";
import { cache } from "react";

export const getSheets = cache(async (): Promise<sheets_v4.Sheets> => {
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.CLIENT_EMAIL;
  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: privateKey,
      client_email: clientEmail,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = await google.sheets({ version: "v4", auth });
  console.log("get sheets");
  return sheets;
});

export const getTable = cache(
  async (sheetName: string): Promise<string[][]> => {
    const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

    if (!spreadsheetId) {
      console.error("Spreadsheet ID is undefined");
      return [];
    }
    const sheets: sheets_v4.Sheets = await getSheets();
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: sheetName,
      });
      console.log("get table");
      return response.data.values as string[][];
    } catch (error: unknown) {
      console.error((error as Error).message);
      return [];
    }
  }
);

export const getTables = cache(
  async (sheets: sheets_v4.Sheets, ranges: string[]): Promise<Tables> => {
    const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

    if (!spreadsheetId) {
      console.error("Spreadsheet ID is undefined");
      return {};
    }

    try {
      const response = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      });

      const valueRanges: sheets_v4.Schema$ValueRange[] | undefined =
        response.data.valueRanges;

      if (!valueRanges) {
        return {};
      }

      return Object.fromEntries(
        ranges.map((name, index) => {
          const values = valueRanges[index]?.values ?? [];
          const header = values[0] ?? [];
          const data = values.slice(1);
          return [name, { header, data }];
        })
      );
    } catch (error: unknown) {
      console.error((error as Error).message);
      return {};
    }
  }
);

export const appendValues = async (sheetName: string, values: string[][]) => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;
  try {
    if (spreadsheetId) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: sheetName,
        valueInputOption: "RAW",
        requestBody: {
          values: values,
        },
      });
    }
  } catch (error: any) {
    console.error(error.message);
  }
};

export async function getSheetIdBySheetName(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string | undefined,
  targetSheetName: string
) {
  try {
    // スプレッドシートのプロパティを取得
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // プロパティから各シートの情報を取得
    const sheetsInfo = response.data.sheets || [];

    // シート名からシートIDを取得
    const sheetInfo = sheetsInfo.find(
      (sheet) => sheet.properties?.title === targetSheetName
    );

    if (sheetInfo) {
      return sheetInfo.properties?.sheetId;
    } else {
      console.log(`Sheet with name '${targetSheetName}' not found.`);
    }
  } catch (error: any) {
    console.error("エラーが発生しました:", error.message);
  }
}

export const rowUpdate = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  spreadsheetName: string,
  rowNumber: number,
  updateValues: string[][]
) => {
  try {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data: [
          {
            majorDimension: "ROWS",
            range: `${spreadsheetName}!A${rowNumber}:${rowNumber}`,
            values: updateValues,
          },
        ],
        valueInputOption: "RAW",
      },
    });
  } catch (error: any) {
    console.error(error.message);
  }
};

export const rowDelete = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  spreadsheetName: string,
  rowNumber: number
) => {
  try {
    const sheetId = await getSheetIdBySheetName(
      sheets,
      spreadsheetId,
      spreadsheetName
    );

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    console.log(`行 ${rowNumber} を削除しました。`);
  } catch (error: any) {
    console.error("エラーが発生しました:", error.message);
  }
};
