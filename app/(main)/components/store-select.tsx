"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store } from "@/lib/types";
import { useRouter } from "next/navigation";

type Props = {
  stores: Store[];
  defaultValue: string;
};
export function StoreSelect({ stores, defaultValue }: Props) {
  const router = useRouter();
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => {
        const params = new URLSearchParams(window.location.search);
        params.set("storeId", value);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="min-w-48">
        <SelectValue placeholder="店舗を選択してください。" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>店舗名</SelectLabel>
          {[...stores].map((store) => {
            return (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
