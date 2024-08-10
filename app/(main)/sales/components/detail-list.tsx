import { ScrollArea } from "@/components/ui/scroll-area";
import { Sales } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  salesData: Sales[];
};
export const DetailList = ({ salesData }: Props) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="px-4 grid">
        {salesData.map((item) => {
          const [year, month, day] = item.date.split("-");
          const { unitPrice, quantity, totalPrice } = item;
          return (
            <div
              key={item.id}
              className={cn(
                "grid grid-cols-3 gap-2 border-b p-2",
                unitPrice * quantity !== totalPrice &&
                  "bg-blue text-primary-foreground"
              )}
            >
              <div>{`${Number(month)}月${Number(day)}日`}</div>
              <div className="text-right">
                {item.unitPrice.toLocaleString()}円
              </div>
              <div className="text-right">
                {item.quantity.toLocaleString()}袋
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
