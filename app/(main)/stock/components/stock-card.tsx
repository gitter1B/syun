import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StockItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StockModal } from "./stock-modal";

type Props = {
  stock: StockItem;
};

export const StockCard = ({ stock }: Props) => {
  const { productName, unitPrice, quantity } = stock;
  return (
    <Card
      className={cn(
        "grid grid-rows-[32px_32px] gap-4 p-4",
        quantity < 0 && "bg-destructive text-destructive-foreground"
      )}
    >
      <div className="grid grid-cols-[4fr_1fr] items-center gap-2">
        <div className="truncate text-[20px] font-semibold">{productName}</div>
        {quantity > 0 && <StockModal stock={stock} />}
      </div>
      <div className="grid grid-cols-2 items-center">
        <div className="text-xl text-right font-semibold">
          {unitPrice.toLocaleString()}円
        </div>
        <div className="text-xl text-right font-semibold">
          {quantity.toLocaleString()}袋
        </div>
      </div>
    </Card>
  );
};
