import "server-only";

import { cache } from "react";

import { Product } from "@/features/products/lib/types";
import { Shipment } from "@/features/shipments/lib/types";

import { getAllShipments } from "@/features/shipments/lib/data";

import { getTable } from "@/lib/sheet";

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const data: string[][] = await getTable("商品");
  return data
    ? data.slice(1).map((row) => {
        return {
          id: row[0],
          name: row[1],
        };
      })
    : [];
});

export const getRecentProducts = cache(async (): Promise<Product[]> => {
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
  const resultProducts: Product[] = [...recentProducts, ...restProducts];

  return resultProducts;
});
