import {
  Product,
  Sales,
  SalesSearchParams,
  Store,
  TotalSales,
} from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { format } from "date-fns-tz";

export const getAllSales = async (
  sheets: sheets_v4.Sheets
): Promise<Sales[]> => {
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "販売",
    });

    const data = response.data.values;
    const salesData: Sales[] = data
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

    return salesData;
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};

export const getFilteredSalesData = async (
  salesData: Sales[],
  searchParams: SalesSearchParams,
  stores: Store[]
) => {
  const thisYear: number = Number(
    format(new Date(), "yyyy", {
      timeZone: "Asia/Tokyo",
    })
  );
  const years: number[] = Array.from({ length: thisYear - 2020 }).map(
    (_, i) => 2021 + i
  );
  const months: number[] = Array.from({ length: 12 }).map((_, i) => i + 1);

  const year: number = years.includes(Number(searchParams.year))
    ? Number(searchParams.year)
    : thisYear;
  const month: number = months.includes(Number(searchParams.month))
    ? Number(searchParams.month)
    : 0;
  const storeId: string = stores.map((s) => s.id).includes(searchParams.storeId)
    ? searchParams.storeId
    : "0";

  return salesData.filter((item) => {
    const date: Date = new Date(item.date);
    return (
      year === date.getFullYear() &&
      (month <= 0 || month === date.getMonth() + 1) &&
      (storeId !== "0" ? item.storeId === storeId : true)
    );
  });
};
export const getTotalSalesData = async (
  salesData: Sales[],
  products: Product[]
): Promise<TotalSales[]> => {
  const totalData: TotalSales[] = products
    .map((product) => {
      const productFilteredData = salesData.filter(
        (item) => item.productId === product.id
      );
      const totalQuantity: number = productFilteredData.reduce(
        (prev, cur) => prev + cur.quantity,
        0
      );
      const totalPrice: number = productFilteredData.reduce(
        (prev, cur) => prev + cur.unitPrice * cur.quantity,
        0
      );
      return {
        productId: product.id,
        productName: product.name,
        totalPrice: totalPrice,
        totalQuantity: totalQuantity,
      };
    })
    .filter((item) => item.totalPrice > 0);
  const sortedData: TotalSales[] = [...totalData].sort(
    (a, b) => b.totalPrice - a.totalPrice
  );
  return sortedData;
};
