import { ShipmentTable } from "./components/shipment-table";
import { ShipmentHeader } from "./components/shipment-header";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { getShipments } from "@/lib/data/shipment";
import { getToday } from "@/lib/date";
import { ShipmentForm } from "./components/shipment-form";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ShipmentPage({
  params,
  searchParams,
}: {
  params: { producerId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today: string = await getToday();
  const producerId: string = (params?.producerId || "") as string;
  const storeId: string = (searchParams?.storeId || "1") as string;
  const date: string = (searchParams?.date || today) as string;
  const { products, stores, shipments, producers } = await getShipments({
    producerId,
  });
  const producerName: string =
    producers.find((producer) => producer.id === producerId)?.name || "";

  if (!producerName) {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <Button variant={"ghost"} asChild>
            <Link href={"/shipment"} className="flex items-center">
              <ChevronLeftIcon size={20} /> 戻る
            </Link>
          </Button>
        </div>

        <div className="text-center">生産者が存在しません。</div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 w-full h-full">
      <div className="flex flex-1 flex-col gap-2">
        <ShipmentHeader
          shipments={shipments}
          stores={stores}
          products={products}
        />
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <ShipmentTable
            producerId={producerId}
            storeId={storeId}
            date={date}
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
