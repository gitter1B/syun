"use client";

import { useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { extractProducerId } from "@/features/producers/lib/utils";
import { ShipmentSchema } from "@/lib/schemas";
import { formatInTimeZone } from "date-fns-tz";

import { Product } from "@/features/products/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import { createShipment } from "@/features/shipments/lib/actions";
import { Store } from "@/features/stores/lib/types";

type Props = {
  stores: Store[];
  products: Product[];
};

export function CreateShipmentForm({ stores, products }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const date = (searchParams.get("date") ||
    formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd")) as string;
  const storeId = (searchParams.get("storeId") || "1") as string;
  const storeName: string = stores.find((s) => s.id === storeId)?.name || "";
  const formattedDate = formatInTimeZone(
    new Date(date),
    "Asia/Tokyo",
    "yyyy年MM月dd日"
  );

  const form = useForm<z.infer<typeof ShipmentSchema>>({
    resolver: zodResolver(ShipmentSchema),
    defaultValues: {
      product: "",
      unitPrice: "",
      quantity: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [productOpen, setProductOpen] = useState<boolean>(false);
  const [productQuery, setProductQuery] = useState<string>("");

  function onSubmit(values: z.infer<typeof ShipmentSchema>) {
    startTransition(async () => {
      const producerId: string = extractProducerId(pathname);

      const { status, message } = await createShipment(
        values,
        producerId,
        date,
        storeId
      );
      form.reset({
        product: form.getValues("product"),
        unitPrice: "",
        quantity: "",
      });
      setProductQuery("");
      setProductOpen(true);
      if (status === "success") {
        toast.success(message);
      } else if (status === "error") {
        toast.error(message);
      }
    });
  }

  return (
    <div className="min-w-96 w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 text-lg font-semibold">
        <div>{formattedDate}</div>
        <div>{storeName}</div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>商品</FormLabel>
                  <Popover open={productOpen} onOpenChange={setProductOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? products.find(
                                (product) => product.id === field.value
                              )?.name
                            : "商品を選択"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full max-w-96 p-0"
                      align="start"
                    >
                      <Command defaultValue={field.value}>
                        <CommandInput
                          className="text-[16px]"
                          placeholder="商品を検索"
                          value={productQuery}
                          onValueChange={setProductQuery}
                        />
                        <CommandEmpty>
                          商品が見つかりませんでした。
                        </CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {products
                              .filter(
                                (p) =>
                                  p.id.includes(productQuery) ||
                                  p.name.includes(productQuery)
                              )
                              .map((product) => (
                                <CommandItem
                                  value={product.id}
                                  key={product.id}
                                  onSelect={() => {
                                    form.setValue("product", product.id);
                                    setProductOpen(false);
                                    form.setFocus("unitPrice");
                                  }}
                                  className="whitespace-nowrap"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      product.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span className="mr-2 w-12">
                                    {product.id}
                                  </span>
                                  {product.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>価格</FormLabel>
                  <FormControl>
                    <Input placeholder="価格" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>個数</FormLabel>
                  <FormControl>
                    <Input placeholder="個数" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-4 md:mt-6">
            <Button
              type="submit"
              className="text-base font-semibold w-full"
              disabled={isPending}
            >
              {isPending && <Loader2Icon className="animate-spin mr-2" />}
              登録する
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
