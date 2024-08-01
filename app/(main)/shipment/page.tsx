import { getTables } from "@/lib/sheet";
import { Product, Shipment, Store, Tables } from "@/lib/types";
import { getRecentSortedProducts } from "@/actions/product";
import { ShipmentTable } from "./components/shipment-table";
import { ShipmentHeader } from "./components/shipment-header";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ShipmentForm } from "./components/shipment-form";
import {
  convertProducts,
  convertShipments,
  convertStores,
} from "@/lib/convert-data";

export default async function ShipmentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tables: Tables = await getTables(["商品", "店舗", "出荷"]);
  const products: Product[] = await convertProducts(tables["商品"].data);
  const stores: Store[] = await convertStores(tables["店舗"].data);
  const shipments: Shipment[] = await convertShipments(tables["出荷"].data);
  const sortedProducts: Product[] = await getRecentSortedProducts(
    shipments,
    products
  );

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-1 flex-col gap-4">
        <ShipmentHeader
          shipments={shipments}
          stores={stores}
          products={sortedProducts}
        />
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <ShipmentTable searchParams={searchParams} />
        </Suspense>
      </div>
      <Separator className="mx-4 hidden xl:block" orientation="vertical" />
      <div className="hidden xl:block">
        <ShipmentForm products={sortedProducts} />
      </div>
    </div>
  );
}
