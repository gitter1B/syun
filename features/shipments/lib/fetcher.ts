import "server-only";

import { cache } from "react";

import { Product } from "@/features/products/lib/types";
import { Store } from "@/features/stores/lib/types";
import { Shipment, ShipmentFilters } from "@/features/shipments/lib/types";

import {
  getAllProducts,
  getRecentProducts,
} from "@/features/products/lib/data";
import { getAllStores } from "@/features/stores/lib/data";
import { getAllShipments, getShipments } from "@/features/shipments/lib/data";

export const fetchShipmentHeader = cache(
  async (): Promise<{
    stores: Store[];
    recentProducts: Product[];
    shipments: Shipment[];
    existDates: Date[];
  }> => {
    const stores: Store[] = await getAllStores();
    const recentProducts: Product[] = await getRecentProducts();
    const shipments: Shipment[] = await getShipments();
    const existDates: Date[] = [
      ...new Set(shipments.map((item) => item.date)),
    ].map((item) => new Date(item));

    return {
      stores,
      recentProducts,
      shipments,
      existDates,
    };
  }
);
export const fetchShipmentFilterGroup = cache(
  async (
    producerId: string
  ): Promise<{
    stores: Store[];
    shipments: Shipment[];
    existDates: Date[];
  }> => {
    const stores: Product[] = await getAllStores();
    const shipments: Shipment[] = await getShipments({ producerId });
    const existDates: Date[] = [
      ...new Set(shipments.map((item) => item.date)),
    ].map((item) => new Date(item));
    return {
      stores,
      shipments,
      existDates,
    };
  }
);

export const fetchCreateShipment = cache(
  async (): Promise<{ stores: Store[]; recentSortedProducts: Product[] }> => {
    const stores: Store[] = await getAllStores();
    const products: Product[] = await getAllProducts();
    const shipments: Shipment[] = await getAllShipments();

    const recentProductIds: string[] = [
      ...new Set(
        shipments
          .toSorted(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((item) => item.productId)
      ),
    ].slice(0, 9);

    const recentProducts: Product[] = recentProductIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product) => product !== undefined) as Product[];

    const restProducts: Product[] = products.filter(
      (product) => !recentProductIds.includes(product.id)
    );
    const recentSortedProducts: Product[] = [
      ...recentProducts,
      ...restProducts,
    ];

    return { stores, recentSortedProducts };
  }
);

export const fetchShipmentTable = cache(
  async (filters: ShipmentFilters): Promise<{ shipments: Shipment[] }> => {
    const shipments: Shipment[] = await getShipments(filters);
    return {
      shipments,
    };
  }
);
