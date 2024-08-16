import { ShipmentTable } from "./components/shipment-table";
import { ShipmentHeader } from "./components/shipment-header";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { getShipments } from "@/lib/data/shipment";
import { getToday } from "@/lib/date";
import { ShipmentForm } from "./components/shipment-form";

export default async function ShipmentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today: string = await getToday();
  const storeId: string = (searchParams?.storeId || "1") as string;
  const date: string = (searchParams?.date || today) as string;

  const { products, stores, shipments } = await getShipments();

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-1 flex-col gap-4">
        <ShipmentHeader
          shipments={shipments}
          stores={stores}
          products={products}
        />
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <ShipmentTable storeId={storeId} date={date} />
        </Suspense>
      </div>
      <Separator className="mx-4 hidden xl:block" orientation="vertical" />
      <div className="hidden xl:block">
        <ShipmentForm products={products} />
      </div>
    </div>
  );
}
