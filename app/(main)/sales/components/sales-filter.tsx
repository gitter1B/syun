import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};
export const SalesFilter = ({ children }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"secondary"} className="gap-2">
          <FilterIcon />
          フィルタ
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">{children}</PopoverContent>
    </Popover>
  );
};
