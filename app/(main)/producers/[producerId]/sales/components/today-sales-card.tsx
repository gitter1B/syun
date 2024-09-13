import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

export const TodaySalesCard = ({
  productName,
  price,
  quantity,
  totalPrice,
}: Props) => {
  return (
    <Card
      className={cn(
        "grid grid-cols-[1fr_80px_50px] items-center gap-2 px-4 p-4",
        price * quantity !== totalPrice && "bg-blue text-primary-foreground"
      )}
    >
      <h2 className="text-[20px] w-full font-semibold flex items-center truncate">
        {productName}
      </h2>
      <div className="text-right">{price.toLocaleString()}円</div>
      <div className="text-right">{quantity.toLocaleString()}袋</div>
    </Card>
  );
};
