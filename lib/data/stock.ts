import {
  convertProducers,
  convertProducts,
  convertSales,
  convertShipments,
  convertStores,
  convertSyunToSales,
  convertWastes,
} from "@/lib/convert-data";
import { getTables } from "@/lib/sheet";
import {
  Producer,
  Product,
  Sales,
  Shipment,
  Stock,
  Store,
  SyunSales,
  Tables,
  Waste,
} from "@/lib/types";
import { getProducerSyunSalesData, getTodaySyunSalesData } from "./sales";

export const getStocks = async (producerId: string): Promise<Stock[]> => {
  const tables: Tables = await getTables([
    "生産者",
    "商品",
    "店舗",
    "出荷",
    "販売",
    "廃棄",
  ]);
  if (!tables) {
    return [];
  }

  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertStores(tables["店舗"].data);
  const shipments: Shipment[] = await convertShipments(tables["出荷"].data);
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
  const wastes: Waste[] = await convertWastes(tables["廃棄"].data);

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

  const newStocks: Stock[] = await Promise.all(
    uniqueShipments
      .filter((item) => item.producerId === producerId)
      .map(async ({ producerId, storeId, productId, unitPrice }, index) => {
        const productName: string =
          products.find((p) => p.id === productId)?.name || "";
        const storeName: string =
          stores.find((s) => s.id === storeId)?.name || "";
        const shipmentTotalQuantity: number = await getTotalQuantity(
          filteredShipments,
          producerId,
          storeId,
          productId,
          unitPrice
        );

        const salesTotalQuantity: number = await getTotalQuantity(
          filteredSalesData,
          producerId,
          storeId,
          productId,
          unitPrice
        );

        const wasteTotalQuantity: number = await getTotalQuantity(
          wastes,
          producerId,
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
          storeName: storeName,
        };
      })
  );
  return newStocks.filter((stock) => stock.quantity !== 0);
};

export const getTotalQuantity = async (
  data: Shipment[] | Sales[] | Waste[],
  producerId: string,
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
        item.producerId === producerId &&
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
  return shipments.filter(({ producerId, storeId, productId, unitPrice }) => {
    const key = `${producerId}-${storeId}-${productId}-${unitPrice}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const fetchStockTable = async (
  producerId: string
): Promise<{
  stocks: Stock[];
  existStoreItems: { storeId: string; storeName: string }[];
}> => {
  const stocks: Stock[] = await getStocks(producerId);
  const existStoreItems: { storeId: string; storeName: string }[] = stocks
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.storeId === item.storeId)
    )
    .map((item) => ({
      storeId: item.storeId,
      storeName: item.storeName!,
    }))
    .toSorted((a, b) => Number(a.storeId) - Number(b.storeId));
  return {
    stocks,
    existStoreItems,
  };
};
