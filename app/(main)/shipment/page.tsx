import { getSheets } from "@/lib/sheet";
import { Product, Shipment, ShipmentItem, Store } from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { getAllStores } from "@/actions/store";
import { getAllProducts } from "@/actions/product";
import { getAllShipments } from "@/actions/shipment";
import { ShipmentTable } from "./components/shipment-table";
import { format } from "date-fns-tz";
import { ShipmentDatePicker } from "./components/shipment-date-picker";
import { StoreSelect } from "../components/store-select";
import { ShipmentForm } from "./components/shipment-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ShipmentHeader } from "./components/shipment-header";
import { Suspense } from "react";

export default async function ShipmentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const date = (searchParams.date ||
    format(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Tokyo" })) as string;
  const storeId = (searchParams.storeId || "1") as string;
  const sheets: sheets_v4.Sheets = await getSheets();
  const stores: Store[] = await getAllStores(sheets);
  const products: Product[] = await getAllProducts(sheets);
  const shipments: Shipment[] = await getAllShipments(sheets);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-1 flex-col gap-4">
        <ShipmentHeader
          shipments={shipments}
          stores={stores}
          products={products}
          date={date}
        />
        <Suspense fallback={<p>loading</p>}>
          <ShipmentTable
            shipments={shipments}
            products={products}
            stores={stores}
            date={date}
            storeId={storeId}
          />
        </Suspense>
      </div>
      <Separator className="mx-4 hidden xl:block" orientation="vertical" />
      <div className="hidden xl:block">
        <ShipmentForm products={products} />
      </div>
    </div>
  );
}
