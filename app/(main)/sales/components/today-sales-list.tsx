import { Sales } from "@/lib/types";
import { TodaySalesCard } from "./today-sales-card";

type Props = {
  todaySalesData: Sales[];
};
export const TodaySalesList = async ({ todaySalesData }: Props) => {
  const storeNames: (string | undefined)[] = [
    ...new Set(todaySalesData.map((item) => item.store?.name)),
  ];

  if (todaySalesData.length === 0) {
    return <div>データがありません</div>;
  }
  return storeNames.map((storeName) => {
    return (
      <div key={storeName} className="flex flex-col gap-2">
        <h1 className="truncate text-xl font-semibold">{storeName}</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {todaySalesData
            .filter((item) => item.store?.name === storeName)
            .map((item) => {
              return (
                <TodaySalesCard
                  key={JSON.stringify(item)}
                  productName={item.product?.name || ""}
                  quantity={item.quantity}
                  price={item.unitPrice}
                  totalPrice={item.totalPrice}
                />
              );
            })}
        </div>
      </div>
    );
  });
};
