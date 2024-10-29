import "server-only";

import { cache } from "react";
import * as cheerio from "cheerio";

import { getTable } from "@/lib/sheet";

import { Producer } from "@/features/producers/lib/types";
import { Product } from "@/features/products/lib/types";
import {
  Sales,
  SalesFilters,
  SyunSales,
  TotalSales,
} from "@/features/sales/lib/types";
import { Store } from "@/features/stores/lib/types";

import { convertDateTextToDateString } from "@/lib/date";
import { getAllProducers } from "@/features/producers/lib/data";
import { getAllProducts } from "@/features/products/lib/data";
import { getAllStores } from "@/features/stores/lib/data";

export const getAllSalesData = cache(async (): Promise<Sales[]> => {
  const data: string[][] = await getTable("販売");
  const products: Product[] = await getAllProducts();
  const stores: Store[] = await getAllStores();

  const salesData = data
    ? data.slice(1).map((row) => {
        const productId: string = row[3];
        const storeId: string = row[7];
        const product: Product | undefined = products.find(
          (p) => p.id === productId
        );
        const store: Store | undefined = stores.find((s) => s.id === storeId);
        return {
          id: row[0],
          producerId: row[1],
          date: row[2],
          productId,
          unitPrice: Number(row[4]),
          quantity: Number(row[5]),
          totalPrice: Number(row[6]),
          storeId,
          product,
          store,
        };
      })
    : [];

  const todaySalesData: Sales[] = await getTodaySalesData(salesData);
  const resultSalesData: Sales[] = await unionSalesData(
    salesData,
    todaySalesData
  );
  return resultSalesData;
});

export const getSalesData = cache(
  async (filters?: SalesFilters): Promise<Sales[]> => {
    const salesData: Sales[] = await getAllSalesData();
    const filteredSalesData = [...salesData].filter((item) => {
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
    });
    return filteredSalesData;
  }
);

export const getTotalSalesData = cache(
  async (
    filters: SalesFilters,
    page: number
  ): Promise<{ totalSalesPrice: number; totalSalesData: TotalSales[] }> => {
    const salesData: Sales[] = await getSalesData(filters);

    const storeMap = new Map<
      string,
      {
        totalSales: number;
        products: {
          product: Product;
          totalQuantity: number;
          totalPrice: number;
          details: {
            unitPrice: number;
            totalQuantity: number;
            totalPrice: number;
          }[];
        }[];
      }
    >();

    salesData.forEach((sale) => {
      if (!storeMap.has(sale.storeId)) {
        storeMap.set(sale.storeId, {
          totalSales: 0,
          products: [],
        });
      }

      const storeData = storeMap.get(sale.storeId)!;

      let productEntry = storeData.products.find(
        (p) => p.product.id === sale.productId
      );
      if (!productEntry) {
        productEntry = {
          product: {
            id: sale.productId,
            name: sale.product?.name || "",
          },
          totalQuantity: 0,
          totalPrice: 0,
          details: [],
        };
        storeData.products.push(productEntry);
      }

      let detail = productEntry.details.find(
        (d) => d.unitPrice === sale.unitPrice
      );
      if (!detail) {
        detail = { unitPrice: sale.unitPrice, totalQuantity: 0, totalPrice: 0 };
        productEntry.details.push(detail);
      }

      detail.totalQuantity += sale.quantity;
      detail.totalPrice += sale.totalPrice;

      productEntry.totalQuantity += sale.quantity;
      productEntry.totalPrice += sale.totalPrice;

      storeData.totalSales += sale.totalPrice;
    });

    const totalSalesPrice = Array.from(storeMap.values()).reduce(
      (sum, storeData) => sum + storeData.totalSales,
      0
    );

    const totalSalesData: TotalSales[] = Array.from(storeMap.values())
      .flatMap(({ products }) =>
        products.map((product) => ({
          product: product.product,
          totalQuantity: product.totalQuantity,
          totalPrice: product.totalPrice,
          details: product.details,
        }))
      )
      .sort((a, b) => b.totalPrice - a.totalPrice);

    const startIndex = (page - 1) * 12;
    const paginatedSalesData = totalSalesData.slice(
      startIndex,
      startIndex + 12
    );

    return { totalSalesPrice, totalSalesData: paginatedSalesData };
  }
);

export const getTodaySyunSalesData = cache(
  async (syunId: string, syunPw: string): Promise<SyunSales[]> => {
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
  }
);

export const getTodaySalesData = cache(
  async (salesData: Sales[]): Promise<Sales[]> => {
    const producers: Producer[] = await getAllProducers();
    if (producers.length === 0) {
      return [];
    }
    let allTodaySyunSalesData: SyunSales[] = [];
    for (let i = 0; i < producers.length; i++) {
      const todaySyunSalesData: SyunSales[] = await getTodaySyunSalesData(
        producers[i].id,
        producers[i].password
      );
      allTodaySyunSalesData = [...allTodaySyunSalesData, ...todaySyunSalesData];
    }
    const resultTodaySalesData = await convertSyunSalesToSales(
      allTodaySyunSalesData,
      salesData
    );
    return resultTodaySalesData;
  }
);

export const convertSyunSalesToSales = cache(
  async (syunSalesData: SyunSales[], salesData: Sales[]): Promise<Sales[]> => {
    const products: Product[] = await getAllProducts();
    const stores: Store[] = await getAllStores();
    const firstId: string = Math.max(
      ...salesData.map((item) => Number(item.id))
    ).toString();

    return syunSalesData.map((item, index) => {
      const product: Product | undefined = products.find(
        (p) => p.name === item.productName
      );
      const store: Store | undefined = stores.find(
        (s) => s.name === item.storeName
      );
      return {
        id: (index + Number(firstId)).toString(),
        producerId: item.producerId,
        date: item.date,
        productId: product?.id || "",
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        storeId: store?.id || "",
        product,
        store,
      };
    });
  }
);

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
