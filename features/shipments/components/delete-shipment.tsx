"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteShipment } from "@/features/shipments/lib/actions";
import { Shipment } from "@/features/shipments/lib/types";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  shipment: Shipment;
  onSuccess?: () => void;
};
export const DeleteShipment = ({ shipment, onSuccess }: Props) => {
  const { date, store, product, unitPrice, quantity } = shipment;
  const storeName: string = store?.name || "";
  const productName: string = product?.name || "";
  const [year, month, day] = date.split("-");
  const formatDate = `${year}年${month}月${day}日`;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex items-center cursor-pointer p-2 w-full"
        asChild
      >
        <Button variant={"destructive"}>
          <Trash2Icon className="mr-2" size={20} />
          削除する
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>このデータを削除しますか？</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <div className="font-semibold text-lg">{storeName}</div>
          <div>{formatDate}</div>
        </div>
        <div className="flex gap-4">
          <div>{productName}</div>
          <div>{unitPrice.toLocaleString()}円</div>
          <div>{quantity.toLocaleString()}個</div>
        </div>
        <div className="flex gap-6 items-center justify-end">
          <Button variant={"outline"} asChild>
            <DialogClose>キャンセル</DialogClose>
          </Button>
          <Button
            onClick={() => {
              startTransition(async () => {
                const { status, message }: { status: string; message: string } =
                  await deleteShipment(shipment.id);
                if (status === "success") {
                  onSuccess?.();
                  setOpen(false);
                  toast.success(message);
                }
                if (status === "error") {
                  toast.error(message);
                }
              });
            }}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            削除する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
