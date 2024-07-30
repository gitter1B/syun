"use client";

import * as React from "react";
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
import { Shipment, Store } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { format, formatInTimeZone } from "date-fns-tz";

type Props = {
  stores: Store[];
  shipments: Shipment[];
};

export function ShipmentStoreSelect({ stores, shipments }: Props) {
  const searchParams = useSearchParams();
  const date = (searchParams.get("date") ||
    formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd")) as string;
  const filteredShipments: Shipment[] = shipments.filter(
    (item) => item.date === date
  );
  const router = useRouter();

  return (
    <Select
      defaultValue={stores[0].id}
      onValueChange={(value) => {
        const params = new URLSearchParams(window.location.search);
        params.set("storeId", value);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="min-w-32 min-[500px]:min-w-48 whitespace-nowrap overflow-hidden">
        <SelectValue placeholder="店舗を選択してください。" />
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
                <div className="flex gap-1">
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
