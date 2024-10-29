"use client";

import { Store } from "@/features/stores/lib/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  stores: Store[];
};
export function StoreSelect({ stores }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId: string = searchParams.get("storeId") || "all";
  return (
    <Select
      defaultValue={storeId}
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("storeId", value);
        params.delete("page");
        router.replace(`?${params.toString()}`, {
          scroll: false,
        });
      }}
    >
      <SelectTrigger className="w-auto">
        <div className="flex items-center p-1">
          <StoreIcon className="mr-2" size={16} />
          <SelectValue placeholder="店舗を選択してください。" />
        </div>
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
