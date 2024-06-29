"use server";
import { google, sheets_v4 } from "googleapis";
import { User } from "./types";

export const getSheets = async (): Promise<sheets_v4.Sheets> => {
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
  return sheets;
};

// export const getShipmentHistories = async (
//   sheets: sheets_v4.Sheets
// ): Promise<User[]> => {
//   const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

//   if (!spreadsheetId) {
//     console.error("Spreadsheet ID is undefined");
//     return [];
//   }

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: "ユーザー",
//     });

//     const data = response.data.values;

//     return data
//       ? data.slice(1).map((row) => {
//           return {
//             id: row[0],
//             username: row[1],
//             password: row[2],
//           };
//         })
//       : [];
//   } catch (error: unknown) {
//     console.error((error as Error).message);
//     return [];
//   }
// };
