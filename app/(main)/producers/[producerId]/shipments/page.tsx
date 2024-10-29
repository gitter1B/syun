import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Producer } from "@/features/producers/lib/types";
import { ShipmentFilters } from "@/features/shipments/lib/types";

import { getProducer } from "@/features/producers/lib/data";

import {
  ShipmentFilterGroup,
  ShipmentFilterGroupSkeleton,
} from "@/features/shipments/components/shipment-filter-group";
import {
  ShipmentList,
  ShipmentListSkeleton,
} from "@/features/shipments/components/shipment-list";
import {
  CreateShipment,
  CreateShipmentSkeleton,
} from "@/features/shipments/components/create-shipment";

import { getToday } from "@/lib/date";

export default async function ShipmentsPage({
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
  const filters: ShipmentFilters = {
    producerId,
    storeId,
    date,
  };
  const producer: Producer | null = await getProducer(producerId);

  if (!producer) {
    redirect("/producers");
  }
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">出荷</div>
        <Suspense fallback={<CreateShipmentSkeleton />}>
          <CreateShipment />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4 border p-4 rounded-sm">
        <Suspense fallback={<ShipmentFilterGroupSkeleton />}>
          <ShipmentFilterGroup producerId={producerId} />
        </Suspense>
        <span className="border-b-2 my-1" />
        <Suspense
          key={JSON.stringify(filters)}
          fallback={<ShipmentListSkeleton />}
        >
          <ShipmentList filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
