"use server";
import {
  Product,
  SyunSales,
  Sales,
  Store,
  TotalSales,
  SalesItem,
} from "@/lib/types";
import { sheets_v4 } from "googleapis";
import * as cheerio from "cheerio";
import { convertDateTextToDateString } from "@/lib/date";
import { getSheets } from "@/lib/sheet";
import { convertProducts, convertStores } from "@/lib/convert-data";

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

export const getSalesData = async (
  storeId: string,
  from: string,
  to: string
): Promise<SalesItem[]> => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const spreadsheetId: string | undefined = process.env.SPREADSHEET_ID;

  if (!spreadsheetId) {
    console.error("Spreadsheet ID is undefined");
    return [];
  }

  try {
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetId,
      ranges: ["商品", "店舗", "販売"],
    });

    const data: sheets_v4.Schema$ValueRange[] | undefined =
      response.data.valueRanges;
    if (!data) {
      return [];
    }

    const products: Product[] = await convertProducts(data[0].values);
    const stores: Store[] = await convertStores(data[1].values);
    const salesData: SalesItem[] = data[2].values
      ? data[2].values
          ?.slice(1)
          .filter((row) => {
            const storeCondition: boolean =
              storeId === "all" ? true : row[5] === storeId;
            const startCondition: boolean =
              new Date(from).getTime() <= new Date(row[1]).getTime();
            const endCondition: boolean =
              new Date(row[1]).getTime() <= new Date(to).getTime();
            return storeCondition && startCondition && endCondition;
          })
          .map((row) => {
            const product: Product = products.find((p) => p.id === row[2])!;
            return {
              id: row[0],
              date: row[1],
              productId: row[2],
              unitPrice: Number(row[3]),
              quantity: Number(row[4]),
              storeId: row[5],
              productName: product.name,
            };
          })
      : [];

    const latestId: number = Math.max(
      ...salesData.map((item) => Number(item.id))
    );
    const { todaySyunSalesData }: { todaySyunSalesData: SyunSales[] } =
      await getTodaySyunSalesData();
    const todaySalesData: SalesItem[] = todaySyunSalesData
      .map((item, index) => {
        const productId: string =
          products.find((p) => p.name === item.productName)?.id || "";
        const storeId: string =
          stores.find((s) => s.name === item.storeName)?.id || "";
        return {
          id: (latestId + index + 1).toString(),
          date: item.date,
          productId: productId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          storeId: storeId,
          productName: item.productName,
        };
      })
      .filter((item) => {
        const storeCondition: boolean =
          storeId === "all" ? true : item.storeId === storeId;
        const startCondition: boolean =
          new Date(from).getTime() <= new Date(item.date).getTime();
        const endCondition: boolean =
          new Date(item.date).getTime() <= new Date(to).getTime();
        return storeCondition && startCondition && endCondition;
      });
    if (
      salesData.map((item) => item.date).includes(todaySalesData.at(0)?.date!)
    ) {
      return salesData;
    }
    return [...salesData, ...todaySalesData];
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};

export const getTotalSalesData = async (
  salesData: SalesItem[]
): Promise<TotalSales[]> => {
  const productIds = [...new Set(salesData.map((item) => item.productId))];

  const totalData: TotalSales[] = productIds
    .map((productId) => {
      const productFilteredData = salesData.filter(
        (item) => item.productId === productId
      );
      const productName: string = productFilteredData[0].productName;
      const totalQuantity: number = productFilteredData.reduce(
        (prev, cur) => prev + cur.quantity,
        0
      );
      const totalPrice: number = productFilteredData.reduce(
        (prev, cur) => prev + cur.unitPrice * cur.quantity,
        0
      );
      return {
        productId: productId,
        productName: productName,
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

export const getTodaySyunSalesData = async (): Promise<{
  header: string;
  todaySyunSalesData: SyunSales[];
}> => {
  const syunUrl: string | undefined = process.env.SYUNURL;
  const syunId: string | undefined = process.env.SYUNID;
  const syunPw: string | undefined = process.env.SYUNPW;
  const todayUrl: string = `${syunUrl}?id=${syunId}&pw=${syunPw}&mode=yesterday`;
  const textDecoder = new TextDecoder("shift-jis");
  const response = await fetch(todayUrl, { cache: "no-store" });
  const arrayBuffer = await response.arrayBuffer();
  const html = textDecoder.decode(arrayBuffer);
  const $ = cheerio.load(html, { decodeEntities: false });
  const header: string = $("h3").text();
  const date = convertDateTextToDateString(header);
  let storeName: string = "";
  let todaySyunSalesData: SyunSales[] = [];
  $('table[id="ls"] > tbody > tr').each((index, element) => {
    const childCount: number = $(element).children().length;
    const isTd: boolean = $(element).children().first().is("td");
    if (isTd && childCount === 1) {
      storeName = $(element).find("td:nth-child(1)").text().trim();
    }
    if (isTd && childCount === 4) {
      const productName: string = $(element)
        .find("td:nth-child(1)")
        .text()
        .trim();
      const unitPrice: number = parseInt(
        $(element).find("td:nth-child(2)").text()
      );
      const quantity: number = parseInt(
        $(element).find("td:nth-child(3)").text()
      );

      todaySyunSalesData.push({
        date: date,
        storeName: storeName,
        productName: productName,
        unitPrice: unitPrice,
        quantity: quantity,
      });
    }
  });
  return { header, todaySyunSalesData };
};

export const getSalesTotalPrice = async (
  salesData: SalesItem[]
): Promise<number> => {
  return salesData.reduce(
    (prev, cur) => prev + cur.unitPrice * cur.quantity,
    0
  );
};
