"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { Item, Product } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  products: Product[];
};

export function SearchProduct({ products }: Props) {
  const router = useRouter();
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
      <PopoverTrigger className="min-w-48" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : "商品を選択してください。"}
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
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex gap-2 items-center">
                    <span className="bg-primary text-primary-foreground py-1 px-2 flex justify-center items-center rounded-full min-w-[60px]">
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
