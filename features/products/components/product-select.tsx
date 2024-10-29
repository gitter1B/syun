"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PackageOpenIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Item } from "@/lib/types";
import { Product } from "@/features/products/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  products: Product[];
};

export function ProductSelect({ products }: Props) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const productId: string | undefined = searchParams.get("productId") || "all";
  const items: Item[] = [
    { value: "all", label: "全商品" },
    ...products.map(({ id, name }) => {
      return {
        value: id,
        label: name,
      };
    }),
  ];
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(productId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between pr-3"
        >
          <div className="flex items-center gap-1">
            <PackageOpenIcon className="mr-1" size={16} />
            <div className="truncate max-w-32 sm:max-w-none">
              {value
                ? items.find((item) => item.value === value)?.label
                : "商品を選択してください。"}
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Command>
          <CommandInput placeholder="" />
          <CommandEmpty>商品が見つかりません。</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value + item.label}
                  onSelect={() => {
                    params.set("productId", item.value);
                    params.delete("page");
                    setValue(item.value);
                    setOpen(false);
                    replace(`${pathname}?${params.toString()}`);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex gap-2 items-center">
                    <span className="bg-primary/30 text-accent-foreground font-semibold py-1 px-2 flex justify-center items-center rounded-full min-w-[60px]">
                      {item.value.toUpperCase()}
                    </span>
                    <div>{item.label}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
