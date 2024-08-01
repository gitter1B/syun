"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Shipment } from "@/lib/types";
import { ShipmentEditForm } from "./shipment-edit-form";
import { useState } from "react";
import { ShipmentDeleteDialog } from "./shipment-delete-dialog";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  shipment: Shipment;
};
export const ShipmentEditSheet = ({ shipment }: Props) => {
  const { productName } = shipment;
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
          <ShipmentEditForm
            shipment={shipment}
            onSuccess={() => setOpen(false)}
          />
          <ShipmentDeleteDialog
            shipment={shipment}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
