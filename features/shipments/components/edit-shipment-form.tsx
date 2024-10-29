"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { ShipmentSchema } from "@/lib/schemas";
import { Shipment } from "@/features/shipments/lib/types";
import { EditIcon, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateShipment } from "@/features/shipments/lib/actions";

type Props = {
  shipment: Shipment;
  onSuccess?: () => void;
};
export function EditShipmentForm({ shipment, onSuccess }: Props) {
  const { id, date, storeId, productId, unitPrice, quantity } = shipment;

  const form = useForm<z.infer<typeof ShipmentSchema>>({
    resolver: zodResolver(ShipmentSchema),
    defaultValues: {
      product: productId,
      unitPrice: unitPrice.toString(),
      quantity: quantity.toString(),
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof ShipmentSchema>) {
    startTransition(async () => {
      const { status, message }: { status: string; message: string } =
        await updateShipment(values, id);
      if (status === "success") {
        onSuccess?.();
        toast.success(message);
      }
      if (status === "error") {
        toast.error(message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-auto">
        <div className="space-y-4">
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
            <EditIcon className="mr-2" size={20} />
            編集する
          </Button>
        </div>
      </form>
    </Form>
  );
}
