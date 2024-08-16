import {
  Product,
  Store,
  Sales,
  SalesFilters,
  Tables,
  SyunSales,
  TotalSales,
} from "@/lib/types";
import { getTables } from "@/lib/sheet";
import {
  convertProducts,
  convertSales,
  convertSalesToTotalSales,
  convertStores,
  convertSyunToSales,
} from "@/lib/convert-data";
import { getToday } from "../date";
import * as cheerio from "cheerio";
import { convertDateTextToDateString } from "@/lib/date";

export const getSalesData = async (
  options?: SalesFilters
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
  let unionedSalesData: Sales[] = await unionSalesData(
    salesData,
    todaySalesData
  );

  const resultSalesData: Sales[] = unionedSalesData
    .filter((item) => {
      let storeIdConditon: boolean = true;
      if (options?.storeId) {
        storeIdConditon =
          options.storeId === "all" ? true : item.storeId === options?.storeId;
      }

      let fromCondition: boolean = true;
      if (options?.from) {
        fromCondition =
          new Date(options.from).getTime() <= new Date(item.date).getTime();
      }

      let toCondition: boolean = true;
      if (options?.to) {
        toCondition =
          new Date(item.date).getTime() <= new Date(options.to).getTime();
      }

      return storeIdConditon && fromCondition && toCondition;
    })
    .map((item) => {
      const product: Product | undefined = products.find(
        (product) => product.id === item.productId
      );

      const store: Product | undefined = stores.find(
        (store) => store.id === item.storeId
      );

      return {
        ...item,
        product,
        store,
      };
    });
  return resultSalesData;
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
export const fetchSalesFilter = async (): Promise<{ stores: Store[] }> => {
  const tables: Tables = await getTables(["店舗"]);
  const stores: Store[] = await convertStores(tables["店舗"].data);

  return { stores };
};

export const fetchSalesList = async (
  options: SalesFilters
): Promise<{
  today: string;
  todaySalesData: Sales[];
  totalSalesData: TotalSales[];
}> => {
  const today: string = await getToday();
  const salesData = await getSalesData(options);
  const todaySalesData: Sales[] = salesData.filter(
    (item) => item.date === today
  );

  const totalSalesData: TotalSales[] = await convertSalesToTotalSales(
    salesData
  );

  return {
    today,
    todaySalesData: todaySalesData,
    totalSalesData,
  };
};

const unionSalesData = async (
  salesData: Sales[],
  todaySalesData: Sales[]
): Promise<Sales[]> => {
  const todayDate: string = todaySalesData[0].date;

  const resultSalesData: Sales[] = [
    ...salesData.filter((item) => {
      return item.date !== todayDate;
    }),
    ...todaySalesData,
  ];
  return resultSalesData;
};
