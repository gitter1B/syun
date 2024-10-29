import { PlusIcon } from "lucide-react";

import { fetchCreateShipment } from "@/features/shipments/lib/fetcher";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateShipmentForm } from "@/features/shipments/components/create-shipment-form";

export const CreateShipment = async () => {
  const { stores, recentSortedProducts } = await fetchCreateShipment();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="font-semibold">
          <PlusIcon className="mr-2" size={20} />
          追加する
        </Button>
      </SheetTrigger>
      <SheetContent side={"top"} className="flex justify-center">
        <SheetHeader>
          <SheetTitle>出荷履歴を登録する。</SheetTitle>
          <SheetDescription></SheetDescription>

          <CreateShipmentForm stores={stores} products={recentSortedProducts} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export const CreateShipmentSkeleton = () => {
  return <Skeleton className="w-28 h-10" />;
};
