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
export const DetailsFilter = ({ children }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"secondary"}>
          <FilterIcon className="mr-2" />
          <span className="text-[16px] font-semibold">フィルタ</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">{children}</PopoverContent>
    </Popover>
  );
};
