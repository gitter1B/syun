import {
  Product,
  Store,
  Sales,
  SalesFilters,
  Tables,
  SyunSales,
  TotalSales,
  Producer,
} from "@/lib/types";
import { getTables } from "@/lib/sheet";
import {
  convertProducers,
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
  filters?: SalesFilters
): Promise<Sales[]> => {
  const tables: Tables = await getTables(["生産者", "商品", "店舗", "販売"]);
  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertProducts(tables["店舗"].data);
  const salesData: Sales[] = await convertSales(tables["販売"].data);
  const producers: Producer[] = await convertProducers(tables["生産者"].data);

  const todaySyunSalesData: SyunSales[] = await getTodaySyunSalesData(
    producers
  );

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
      let producerCondition: boolean = true;
      if (filters?.producerId) {
        producerCondition = item.producerId === filters.producerId;
      }
      let storeIdConditon: boolean = true;
      if (filters?.storeId) {
        storeIdConditon =
          filters.storeId === "all" ? true : item.storeId === filters?.storeId;
      }
      let productIdCondition: boolean = true;
      if (filters?.productId) {
        productIdCondition =
          filters.productId === "all"
            ? true
            : item.productId === filters.productId;
      }

      let fromCondition: boolean = true;
      if (filters?.from) {
        fromCondition =
          new Date(filters.from).getTime() <= new Date(item.date).getTime();
      }

      let toCondition: boolean = true;
      if (filters?.to) {
        toCondition =
          new Date(item.date).getTime() <= new Date(filters.to).getTime();
      }

      return (
        producerCondition &&
        storeIdConditon &&
        productIdCondition &&
        fromCondition &&
        toCondition
      );
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

export const getTodaySyunSalesData = async (
  producers: Producer[]
): Promise<SyunSales[]> => {
  let resultSyunSalesData: SyunSales[] = [];
  if (producers.length === 0) {
    return [];
  }
  for (let i = 0; i < producers.length; i++) {
    const todaySyunSalesData: SyunSales[] = await getProducerSyunSalesData(
      producers[i].id,
      producers[i].password
    );
    resultSyunSalesData = [...resultSyunSalesData, ...todaySyunSalesData];
  }
  return resultSyunSalesData;
};

export const getProducerSyunSalesData = async (
  syunId: string,
  syunPw: string
): Promise<SyunSales[]> => {
  const syunUrl: string | undefined = process.env.SYUNURL;
  if (!syunUrl || !syunId || !syunPw) {
    return [];
  }
  const todayUrl: string = `${syunUrl}?id=${syunId}&pw=${syunPw}&mode=yesterday`;
  const textDecoder = new TextDecoder("shift-jis");
  const response = await fetch(todayUrl, { cache: "no-store" });
  const arrayBuffer = await response.arrayBuffer();
  const html = textDecoder.decode(arrayBuffer);
  const $ = cheerio.load(html, { decodeEntities: false });
  const header: string = $("h3").text();
  const date = convertDateTextToDateString(header);
  if (!date) {
    return [];
  }
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
        producerId: syunId.toString(),
        storeName: storeName,
        productName: productName,
        unitPrice: unitPrice,
        quantity: quantity,
        totalPrice: totalPrice,
      });
    }
  });
  return todaySyunSalesData;
};
export const fetchSalesFilter = async (): Promise<{ stores: Store[] }> => {
  const tables: Tables = await getTables(["店舗"]);
  const stores: Store[] = await convertStores(tables["店舗"].data);

  return { stores };
};

export const fetchSalesList = async (
  filters: SalesFilters
): Promise<{
  today: string;
  todaySalesData: Sales[];
  totalSalesData: TotalSales[];
}> => {
  const today: string = await getToday();
  const salesData = await getSalesData(filters);
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
  if (todaySalesData.length === 0) {
    return salesData;
  }
  const todayDate: string = todaySalesData[0].date;

  const resultSalesData: Sales[] = [
    ...salesData.filter((item) => {
      return item.date !== todayDate;
    }),
    ...todaySalesData,
  ];
  return resultSalesData;
};
