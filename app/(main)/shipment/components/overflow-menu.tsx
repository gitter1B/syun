"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditIcon, EllipsisIcon } from "lucide-react";
import { ShipmentDeleteDialog } from "./shipment-delete-dialog";
import { Product, ShipmentItem } from "@/lib/types";
import { ShipmentEditDialog } from "./shipment-edit-dialog";

type Props = {
  shipmentItem: ShipmentItem;
  products: Product[];
};
export const OverflowMenu = ({ shipmentItem, products }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="p-0 w-full"
        >
          <ShipmentEditDialog shipmentItem={shipmentItem} products={products} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="p-0 w-full"
        >
          <ShipmentDeleteDialog shipmentItem={shipmentItem} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
