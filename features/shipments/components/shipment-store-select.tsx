"use client";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { formatInTimeZone } from "date-fns-tz";
import { StoreIcon } from "lucide-react";

import { Store } from "@/features/stores/lib/types";
import { Shipment } from "@/features/shipments/lib/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  stores: Store[];
  shipments: Shipment[];
};

export function ShipmentStoreSelect({ stores, shipments }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const storeId: string = searchParams.get("storeId") || "1";
  const date = (searchParams.get("date") ||
    formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd")) as string;
  const filteredShipments: Shipment[] = shipments.filter(
    (item) => item.date === date
  );

  return (
    <Select
      defaultValue={storeId}
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("storeId", value);
        router.replace(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-auto">
        <div className="flex items-center p-1 rounded-sm justify-start text-left whitespace-nowrap overflow-hidden">
          <StoreIcon className="mr-2" size={16} />
          <SelectValue placeholder="店舗を選択してください。" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>店舗名</SelectLabel>
          <SelectSeparator className="mb-2" />
          {[...stores].map((store) => {
            const count: number = filteredShipments.filter(
              (item) => item.storeId === store.id
            ).length;
            return (
              <SelectItem
                key={store.id}
                value={store.id}
                className="whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  {store.name}
                  {count > 0 && (
                    <span className="rounded-full bg-primary text-primary-foreground flex items-center justify-center px-2">
                      {count}
                    </span>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
