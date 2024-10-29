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
import { WasteEditDialog } from "./waste-edit-dialog";
import { WasteDeleteDialog } from "./waste-delete-dialog";
import { Waste } from "@/features/wastes/lib/types";

type Props = {
  wasteItem: Waste;
};

export const WasteUpdateMenu = ({ wasteItem }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} className="flex gap-2 items-center">
          訂正
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(e) => e.preventDefault()}
        >
          <WasteEditDialog wasteItem={wasteItem} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(e) => e.preventDefault()}
        >
          <WasteDeleteDialog wasteItem={wasteItem} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
