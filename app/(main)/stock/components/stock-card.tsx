import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StockModal } from "./stock-modal";

type Props = {
  productName: string;
  stock: Stock;
};

export const StockCard = ({ productName, stock }: Props) => {
  return (
    <Card className={cn(stock.quantity < 0 && "bg-destructive/80")}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="truncate">{productName}</CardTitle>
          {stock.quantity > 0 && (
            <StockModal productName={productName} stock={stock} />
          )}
        </div>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2">
          <div className="text-xl text-right font-semibold">
            {stock.unitPrice.toLocaleString()}円
          </div>
          <div className="text-xl text-right font-semibold">
            {stock.quantity.toLocaleString()}袋
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
