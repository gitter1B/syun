import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRightIcon, LineChartIcon } from "lucide-react";

type Props = {
  productId?: string;
  productName: string;
  price: number;
  quantity: number;
};

export const SalesCard = ({
  productId,
  productName,
  price,
  quantity,
}: Props) => {
  return (
    <Card className="flex flex-col gap-2 px-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] w-full font-semibold flex items-center justify-between truncate">
          {productName}
        </h2>
        <Button asChild variant={"outline"}>
          <Link href={`/sales/detail/${productId}`} className="flex gap-2">
            <LineChartIcon size={20} />
            詳細
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 text-[16px] gap-4">
        <div className="text-right">{quantity.toLocaleString()}袋</div>
        <div className="text-right">{price.toLocaleString()}円</div>
      </div>
    </Card>
  );
};
