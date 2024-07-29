"use server";
import {
  convertProducts,
  convertSales,
  convertShipments,
  convertStores,
  convertSyunToSales,
  convertWastes,
} from "@/lib/convert-data";
import { getSheets, getTables } from "@/lib/sheet";
import {
  Product,
  Sales,
  Shipment,
  Stock,
  StockItem,
  Store,
  SyunSales,
  Waste,
} from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { getTodaySyunSalesData } from "./sales";

export const getAllStocks = async (
  shipments: Shipment[],
  salesData: Sales[],
  wastes: Waste[]
): Promise<Stock[]> => {
  const oldestDate: string = "2024-01-05";

  const filteredShipments: Shipment[] = shipments.filter(
    (item) => new Date(oldestDate).getTime() <= new Date(item.date).getTime()
  );

  const filteredSalesData: Sales[] = salesData.filter(
    (item) => new Date(oldestDate).getTime() <= new Date(item.date).getTime()
  );

  const uniqueShipments: Shipment[] = await getUniqueShipments(
    filteredShipments
  );

  const newStocks: Stock[] = await Promise.all(
    uniqueShipments.map(async ({ storeId, productId, unitPrice }, index) => {
      const shipmentTotalQuantity: number = await getTotalQuantity(
        filteredShipments,
        storeId,
        productId,
        unitPrice
      );

      const salesTotalQuantity: number = await getTotalQuantity(
        filteredSalesData,
        storeId,
        productId,
        unitPrice
      );

      const wasteTotalQuantity: number = await getTotalQuantity(
        wastes,
        storeId,
        productId,
        unitPrice
      );

      const totalQuantity: number =
        shipmentTotalQuantity - salesTotalQuantity - wasteTotalQuantity;

      return {
        id: (index + 1).toString(),
        storeId: storeId,
        productId: productId,
        unitPrice: unitPrice,
        quantity: totalQuantity,
      };
    })
  );
  return newStocks;
};

export const getStocks = async (
  data: sheets_v4.Schema$ValueRange[] | undefined
): Promise<StockItem[]> => {
  if (!data) {
    return [];
  }
  const { todaySyunSalesData }: { todaySyunSalesData: SyunSales[] } =
    await getTodaySyunSalesData();

  const products: Product[] = await convertProducts(data[0].values);
  const stores: Store[] = await convertStores(data[1].values);
  const shipments: Shipment[] = await convertShipments(data[2].values);
  const salesData: Sales[] = await convertSales(data[3].values);
  const todaySalesData: Sales[] = await convertSyunToSales(
    salesData,
    todaySyunSalesData,
    products,
    stores
  );
  const wastes: Waste[] = await convertWastes(data[4].values);

  const todayDate: string = todaySalesData.at(0)?.date || "";
  const isTodayIncluded: boolean = salesData
    .map((item) => item.date)
    .includes(todayDate);
  const conbinedSalesData: Sales[] = isTodayIncluded
    ? salesData
    : [...salesData, ...todaySalesData];

  const oldestDate: string = "2024-01-05";

  const filteredShipments: Shipment[] = shipments.filter(
    (item) => new Date(oldestDate).getTime() <= new Date(item.date).getTime()
  );

  const filteredSalesData: Sales[] = conbinedSalesData.filter(
    (item) => new Date(oldestDate).getTime() <= new Date(item.date).getTime()
  );

  const uniqueShipments: Shipment[] = await getUniqueShipments(
    filteredShipments
  );

  const newStocks: StockItem[] = await Promise.all(
    uniqueShipments.map(async ({ storeId, productId, unitPrice }, index) => {
      const productName: string =
        products.find((p) => p.id === productId)?.name || "";
      const shipmentTotalQuantity: number = await getTotalQuantity(
        filteredShipments,
        storeId,
        productId,
        unitPrice
      );

      const salesTotalQuantity: number = await getTotalQuantity(
        filteredSalesData,
        storeId,
        productId,
        unitPrice
      );

      const wasteTotalQuantity: number = await getTotalQuantity(
        wastes,
        storeId,
        productId,
        unitPrice
      );

      const totalQuantity: number =
        shipmentTotalQuantity - salesTotalQuantity - wasteTotalQuantity;

      return {
        id: (index + 1).toString(),
        storeId: storeId,
        productId: productId,
        unitPrice: unitPrice,
        quantity: totalQuantity,
        productName: productName,
      };
    })
  );
  return newStocks.filter((stock) => stock.quantity !== 0);
};
export const getTotalQuantity = async (
  data: Shipment[] | Sales[] | Waste[],
  storeId: string,
  productId: string,
  unitPrice: number
): Promise<number> => {
  if (data.length === 0) {
    return 0;
  }
  const totalQuantity: number = data
    .filter((item) => {
      return (
        item.storeId === storeId &&
        item.productId === productId &&
        item.unitPrice === unitPrice
      );
    })
    .reduce((prev, cur) => prev + cur.quantity, 0);
  return totalQuantity;
};

export const getUniqueShipments = async (
  shipments: Shipment[]
): Promise<Shipment[]> => {
  const seen = new Set();
  return shipments.filter(({ storeId, productId, unitPrice }) => {
    const key = `${storeId}-${productId}-${unitPrice}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
