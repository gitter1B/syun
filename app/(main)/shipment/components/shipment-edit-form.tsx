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
import { Product, ShipmentItem, Store } from "@/lib/types";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { updateShipment } from "@/actions/shipment";
import { useRouter } from "next/navigation";

type Props = {
  shipmentItem: ShipmentItem;
  products: Product[];
  dialogClose: () => void;
};
export function ShipmentEditForm({
  shipmentItem,
  products,
  dialogClose,
}: Props) {
  const { id, date, storeId, productId, unitPrice, quantity } = shipmentItem;

  const form = useForm<z.infer<typeof ShipmentSchema>>({
    resolver: zodResolver(ShipmentSchema),
    defaultValues: {
      product: productId,
      unitPrice: unitPrice.toString(),
      quantity: quantity.toString(),
    },
  });

  const [isPending, startTransition] = useTransition();
  const [productOpen, setProductOpen] = useState<boolean>(false);

  function onSubmit(values: z.infer<typeof ShipmentSchema>) {
    startTransition(async () => {
      await updateShipment(values, id, date, storeId);
      dialogClose();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-auto">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>商品</FormLabel>
                <Popover
                  modal={true}
                  open={productOpen}
                  onOpenChange={setProductOpen}
                >
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
                        className="text-[16px]"
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
              <FormItem>
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
              <FormItem>
                <FormLabel>個数</FormLabel>
                <FormControl>
                  <Input placeholder="個数" inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2" />}
            更新する
          </Button>
        </div>
      </form>
    </Form>
  );
}
