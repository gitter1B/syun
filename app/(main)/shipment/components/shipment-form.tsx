"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ShipmentSchema } from "@/schemas";
import { Product, Store } from "@/lib/types";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { addShipment } from "@/actions/shipment";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns-tz";

type Props = {
  products: Product[];
};
export function ShipmentForm({ products }: Props) {
  const searchParams = useSearchParams();

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

  function onSubmit(values: z.infer<typeof ShipmentSchema>) {
    startTransition(async () => {
      const date = (searchParams.get("date") ||
        format(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Tokyo" })) as string;
      const storeId = (searchParams.get("storeId") || "1") as string;
      await addShipment(values, date, storeId);
      form.reset({
        product: form.getValues("product"),
        unitPrice: "",
        quantity: "",
      });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="xl:w-96 w-auto px-4"
      >
        <div className="md:space-y-4 space-y-2">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4 md:block">
                <FormLabel className="whitespace-nowrap mt-2 text-right text-base">
                  商品
                </FormLabel>
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
                  <PopoverContent className="w-full max-w-96 p-0" align="start">
                    <Command>
                      <CommandInput
                        className="text-base"
                        placeholder="商品を検索"
                      />
                      <CommandEmpty>商品が見つかりませんでした。</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              value={product.id + product.name}
                              key={product.id}
                              onSelect={() => {
                                form.setValue("product", product.id);
                                setProductOpen(false);
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
                              <span className="mr-2 w-12">{product.id}</span>
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
              <FormItem className="flex items-center gap-4 md:block">
                <FormLabel className="whitespace-nowrap mt-2 text-right text-base">
                  価格
                </FormLabel>
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
              <FormItem className="flex items-center gap-4 md:block">
                <FormLabel className="whitespace-nowrap mt-2 text-right text-base">
                  個数
                </FormLabel>
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
            className="md:w-full text-base"
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="animate-spin mr-2" />}
            登録する
          </Button>
        </div>
      </form>
    </Form>
  );
}
