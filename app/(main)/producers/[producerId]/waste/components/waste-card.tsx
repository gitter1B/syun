import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Waste } from "@/lib/types";
import { format } from "date-fns";
import { WasteUpdateMenu } from "./waste-update-menu";

type Props = {
  wasteItem: Waste;
};

export const WasteCard = ({ wasteItem }: Props) => {
  const { date, product, store, unitPrice, quantity } = wasteItem;
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-md font-semibold truncate">{store?.name}</span>
          <span className="text-base font-medium truncate">
            {format(date, "yyyy年MM月dd日")}
          </span>
          <WasteUpdateMenu wasteItem={wasteItem} />
        </div>
        <div className="flex items-center justify-between gap-2 text-right text-[16px] font-semibold">
          <div className="text-[20px] font-semibold truncate">
            {product?.name}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>{unitPrice.toLocaleString()}円</div>
            <div>{quantity.toLocaleString()}袋</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
