"use server";
import {
  Product,
  SyunSales,
  Sales,
  Store,
  TotalSales,
  Tables,
} from "@/lib/types";
import { sheets_v4 } from "googleapis";
import * as cheerio from "cheerio";
import { convertDateTextToDateString } from "@/lib/date";
import { getTables } from "@/lib/sheet";
import {
  convertProducts,
  convertSales,
  convertShipments,
  convertSyunToSales,
} from "@/lib/convert-data";

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
            totalPrice: Number(row[5]),
            storeId: row[6],
          };
        })
      : [];

    return salesData;
  } catch (error: unknown) {
    console.error((error as Error).message);
    return [];
  }
};

export const getSales = async (
  from?: string,
  to?: string,
  storeId?: string,
  productId?: string
): Promise<Sales[]> => {
  const tables: Tables = await getTables(["商品", "店舗", "販売"]);
  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertProducts(tables["店舗"].data);
  const salesData: Sales[] = await convertSales(tables["販売"].data);
  const {
    header,
    todaySyunSalesData,
  }: {
    header: string;
    todaySyunSalesData: SyunSales[];
  } = await getTodaySyunSalesData();

  const todaySalesData: Sales[] = await convertSyunToSales(
    salesData,
    todaySyunSalesData,
    products,
    stores
  );

  let filteredSalesData: Sales[] = [...salesData, ...todaySalesData];

  if (storeId) {
    filteredSalesData = filteredSalesData.filter((item) =>
      storeId === "all" ? true : item.storeId === storeId
    );
  }

  if (from) {
    filteredSalesData = filteredSalesData.filter(
      (item) => new Date(from).getTime() <= new Date(item.date).getTime()
    );
  }

  if (to) {
    filteredSalesData = filteredSalesData.filter(
      (item) => new Date(item.date).getTime() <= new Date(to).getTime()
    );
  }
  if (productId) {
    filteredSalesData = filteredSalesData.filter((item) =>
      productId === "all" ? true : item.productId === productId
    );
  }

  const resultSalesData: Sales[] = filteredSalesData.map((item) => {
    const productName: string =
      products.find((p) => p.id === item.productId)?.name || "";
    const storeName: string =
      stores.find((s) => s.id === item.storeId)?.name || "";
    return {
      ...item,
      productName,
      storeName,
    };
  });
  return resultSalesData;
};

export const getTotalSalesData = async (
  salesData: Sales[]
): Promise<TotalSales[]> => {
  const productIds: string[] = [
    ...new Set(salesData.map((item) => item.productId)),
  ];

  const totalData: TotalSales[] = productIds
    .map((productId) => {
      const productFilteredData = salesData.filter(
        (item) => item.productId === productId
      );
      const productName: string = productFilteredData[0].productName || "";
      const totalQuantity: number = productFilteredData.reduce(
        (prev, cur) => prev + cur.quantity,
        0
      );
      const totalPrice: number = productFilteredData.reduce(
        (prev, cur) => prev + cur.totalPrice,
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
      const unitPrice: number = Number(
        $(element)
          .find("td:nth-child(2)")
          .text()
          .replace(",", "")
          .replace("円", "")
      );
      const quantity: number = Number(
        $(element).find("td:nth-child(3)").text()
      );
      const totalPrice: number = Number(
        $(element)
          .find("td:nth-child(4)")
          .text()
          .replace(",", "")
          .replace("円", "")
      );

      todaySyunSalesData.push({
        date: date,
        storeName: storeName,
        productName: productName,
        unitPrice: unitPrice,
        quantity: quantity,
        totalPrice: totalPrice,
      });
    }
  });
  return { header, todaySyunSalesData };
};

export const getSalesTotalPrice = async (
  salesData: Sales[]
): Promise<number> => {
  return salesData.reduce((prev, cur) => prev + cur.totalPrice, 0);
};
