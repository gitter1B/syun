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
        "grid gap-4 p-4",
        quantity < 0 && "bg-destructive text-destructive-foreground"
      )}
    >
      <div className="grid grid-cols-[1fr_80px_50px_auto] items-center gap-3">
        <div className="truncate text-lg font-semibold">{productName}</div>
        <div className="text-base text-right font-semibold truncate">
          {unitPrice.toLocaleString()}円
        </div>
        <div className="text-base text-right font-semibold truncate">
          {quantity.toLocaleString()}袋
        </div>
        <div>{quantity < 0 && <StockModal stock={stock} />}</div>
      </div>
    </Card>
  );
};
