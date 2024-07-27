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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  items: { value: string; label: string }[];
  name: string;
  placeholder: string;
};
export function SearchSelect({ items, name, placeholder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storeId: string | undefined = searchParams.get(name) || "all";
  return (
    <Select
      defaultValue={storeId}
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map(({ value, label }) => {
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
