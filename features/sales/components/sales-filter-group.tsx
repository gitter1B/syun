import { Store } from "@/features/stores/lib/types";

import { getAllStores } from "@/features/stores/lib/data";

import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { StoreSelect } from "@/features/stores/components/store-select";
import { Skeleton } from "@/components/ui/skeleton";

export const SalesFilterGroup = async () => {
  const stores: Store[] = await getAllStores();
  return (
    <div className="flex flex-col gap-4">
      <span className="w-full border-b pb-2 border-dashed ">フィルタ</span>
      <div className="grid grid-cols-2 gap-4 sm:flex">
        <div className="flex flex-col gap-2">
          <Label>開始日付</Label>
          <DatePicker name="from" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>終了日付</Label>
          <DatePicker name="to" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>店舗</Label>
          <StoreSelect stores={stores} />
        </div>
      </div>
    </div>
  );
};

export const SalesFilterGroupSkeleton = () => {
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
        <div className="flex flex-col gap-2">
          <Skeleton className="w-10 h-5" />
          <Skeleton className="w-40 h-10" />
        </div>
      </div>
    </div>
  );
};
