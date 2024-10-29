"use client";

import { useState } from "react";

import { Shipment } from "@/features/shipments/lib/types";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EditShipmentForm } from "@/features/shipments/components/edit-shipment-form";
import { DeleteShipment } from "@/features/shipments/components/delete-shipment";

import { EditIcon } from "lucide-react";

type Props = {
  shipment: Shipment;
};
export const EditShipment = ({ shipment }: Props) => {
  const productName = shipment.product?.name;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="w-full">
          <Button variant={"outline"} className="hidden sm:inline-flex">
            <EditIcon className="mr-2" size={20} />
            <span className="font-semibold">編集する</span>
          </Button>
          <Button variant={"outline"} size={"icon"} className="sm:hidden">
            <EditIcon size={20} />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:min-w-[60px]">
        <SheetHeader>
          <SheetTitle>編集してください</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-semibold">{productName}</div>
          <EditShipmentForm
            shipment={shipment}
            onSuccess={() => setOpen(false)}
          />
          <SheetClose asChild>
            <Button variant={"outline"}>キャンセル</Button>
          </SheetClose>
          <DeleteShipment
            shipment={shipment}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
