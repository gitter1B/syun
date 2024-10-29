import "server-only";

import { cache } from "react";

import { Sales } from "@/features/sales/lib/types";
import { Shipment } from "@/features/shipments/lib/types";
import { Stock } from "@/features/stocks/lib/types";
import { Waste } from "@/features/wastes/lib/types";

import { getAllShipments } from "@/features/shipments/lib/data";
import { getAllSalesData } from "@/features/sales/lib/data";
import { getAllWastes } from "@/features/wastes/lib/data";

export const getStocks = cache(async (producerId: string): Promise<Stock[]> => {
  const shipments: Shipment[] = await getAllShipments();
  const salesData: Sales[] = await getAllSalesData();
  const wastes: Waste[] = await getAllWastes();

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
    uniqueShipments
      .filter((item) => item.producerId === producerId)
      .map(
        async (
          { producerId, storeId, productId, unitPrice, product, store },
          index
        ) => {
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
            productName: product?.name,
            storeName: store?.name,
          };
        }
      )
  );
  return newStocks.filter((stock) => stock.quantity !== 0);
});

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
