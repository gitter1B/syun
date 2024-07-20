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
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  stores: Store[];
  resetPage?: boolean;
};
export function StoreSelect({ stores, resetPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId: string | undefined = searchParams.get("storeId") || "all";
  return (
    <Select
      defaultValue={storeId}
      onValueChange={(value) => {
        const params = new URLSearchParams(window.location.search);
        params.set("storeId", value);
        if (resetPage) params.set("page", "1");
        router.push(`?${params.toString()}`, {
          scroll: false,
        });
      }}
    >
      <SelectTrigger className="min-w-48">
        <SelectValue placeholder="店舗を選択してください。" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key={"all"} value={"all"}>
            全店舗
          </SelectItem>
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
