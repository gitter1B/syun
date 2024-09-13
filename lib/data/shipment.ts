import {
  convertProducers,
  convertProducts,
  convertShipments,
  convertStores,
} from "@/lib/convert-data";
import { getTables } from "@/lib/sheet";
import {
  Producer,
  Product,
  Shipment,
  ShipmentFilters,
  Store,
  Tables,
} from "@/lib/types";

export const getShipments = async (
  options?: ShipmentFilters
): Promise<{
  products: Product[];
  stores: Store[];
  shipments: Shipment[];
  producers: Producer[];
}> => {
  const tables: Tables = await getTables(["商品", "店舗", "出荷", "生産者"]);
  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertStores(tables["店舗"].data);
  const shipments: Shipment[] = await convertShipments(tables["出荷"].data);
  const producers: Producer[] = await convertProducers(tables["生産者"].data);
  const sortedProducts: Product[] = await getRecentSortedProducts(
    shipments,
    products
  );

  return {
    products: sortedProducts,
    stores,
    producers,
    shipments: shipments
      .filter((shipment) => {
        let producerIdCondition: boolean = true;
        if (options?.producerId) {
          producerIdCondition = shipment.producerId === options.producerId;
        }
        let storeIdCondition: boolean = true;
        if (options?.storeId) {
          storeIdCondition = shipment.storeId === options.storeId;
        }
        let dateCondition: boolean = true;
        if (options?.date) {
          dateCondition = shipment.date === options.date;
        }
        return producerIdCondition && storeIdCondition && dateCondition;
      })
      .map((shipment) => {
        const product: Product | undefined = products.find(
          (product) => product.id === shipment.productId
        );
        const store: Product | undefined = products.find(
          (store) => store.id === shipment.storeId
        );
        return {
          ...shipment,
          product,
          store,
        };
      }),
  };
};

export const getRecentSortedProducts = async (
  shipments: Shipment[],
  products: Product[]
): Promise<Product[]> => {
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
  const sortedProducts: Product[] = [...recentProducts, ...restProducts];

  return sortedProducts;
};
