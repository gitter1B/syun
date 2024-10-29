import "server-only";

import { cache } from "react";
import { getTable } from "@/lib/sheet";

import { Store } from "@/features/stores/lib/types";
import { Product } from "@/features/products/lib/types";
import { Shipment, ShipmentFilters } from "@/features/shipments/lib/types";

import { getAllProducts } from "@/features/products/lib/data";
import { getAllStores } from "@/features/stores/lib/data";

export const getAllShipments = cache(async (): Promise<Shipment[]> => {
  const data: string[][] = await getTable("出荷");
  const products: Product[] = await getAllProducts();
  const stores: Product[] = await getAllStores();

  return data
    ? data.slice(1).map((row) => {
        const productId: string = row[3];
        const storeId: string = row[6];

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
          storeId,
          product,
          store,
        };
      })
    : [];
});

export const getShipments = cache(
  async (filters?: ShipmentFilters): Promise<Shipment[]> => {
    const shipments: Shipment[] = await getAllShipments();
    const filteredShipments = shipments.filter((shipment) => {
      let producerIdCondition: boolean = true;
      if (filters?.producerId) {
        producerIdCondition = shipment.producerId === filters.producerId;
      }
      let storeIdCondition: boolean = true;
      if (filters?.storeId) {
        storeIdCondition = shipment.storeId === filters.storeId;
      }
      let dateCondition: boolean = true;
      if (filters?.date) {
        dateCondition = shipment.date === filters.date;
      }
      return producerIdCondition && storeIdCondition && dateCondition;
    });
    return filteredShipments;
  }
);

export const getNewShipmentId = cache(async (): Promise<number> => {
  const data: string[][] = await getTable("出荷");

  const newId: number = Math.max(...data.map((row) => Number(row[0]))) + 1;

  return newId;
});
