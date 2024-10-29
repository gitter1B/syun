import { fetchShipmentFilterGroup } from "@/features/shipments/lib/fetcher";

import { ShipmentStoreSelect } from "@/features/shipments/components/shipment-store-select";
import { ShipmentDatePicker } from "@/features/shipments/components/shipment-date-picker";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  producerId: string;
};
export const ShipmentFilterGroup = async ({ producerId }: Props) => {
  const { stores, shipments, existDates } = await fetchShipmentFilterGroup(
    producerId
  );

  return (
    <div className="flex flex-col gap-4">
      <span className="w-full border-b pb-2 border-dashed">フィルタ</span>
      <div className="grid grid-cols-2 gap-4 sm:flex">
        <div className="flex flex-col gap-2">
          <Label>日付</Label>
          <ShipmentDatePicker existDates={existDates} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>店舗</Label>
          <ShipmentStoreSelect stores={stores} shipments={shipments} />
        </div>
      </div>
    </div>
  );
};

export const ShipmentFilterGroupSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <span className="w-full border-b pb-2 border-dashed">フィルタ</span>
      <div className="grid grid-cols-2 gap-4 sm:flex">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-10 h-5" />
          <Skeleton className="w-40 h-10" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-10 h-5" />
          <Skeleton className="w-40 h-10" />
        </div>
      </div>
    </div>
  );
};
