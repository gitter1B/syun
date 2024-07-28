"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product, ShipmentItem } from "@/lib/types";
import { EditIcon } from "lucide-react";
import { ShipmentEditForm } from "./shipment-edit-form";
import { useState } from "react";

type Props = {
  shipmentItem: ShipmentItem;
  products: Product[];
};
export const ShipmentEditDialog = ({ shipmentItem, products }: Props) => {
  const { storeName, date } = shipmentItem;
  const [year, month, day] = date.split("-");
  const formatDate = `${year}年${month}月${day}日`;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center cursor-pointer p-2 w-full">
        <EditIcon size={20} className="mr-2" />
        編集
      </DialogTrigger>

      <DialogContent className="p-10">
        <DialogHeader>
          <DialogTitle className="mb-2">編集してください。</DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex justify-between text-lg">
            <div>{storeName}</div>
            <div>{formatDate}</div>
          </div>
        </DialogHeader>
        <ShipmentEditForm
          shipmentItem={shipmentItem}
          products={products}
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
