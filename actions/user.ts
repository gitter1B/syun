"use server";

import { User } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export const getAllUsers = async (
  sheets: sheets_v4.Sheets
): Promise<User[]> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "ユーザー",
    });

    const data = response.data.values;

    return data
      ? data.slice(1).map((row) => {
          return {
            id: row[0],
            username: row[1],
            password: row[2],
          };
        })
      : [];
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};
