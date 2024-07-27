import { getTodaySyunSalesData } from "@/actions/sales";
import { SyunSales } from "@/lib/types";
import { TodaySalesCard } from "./today-sales-card";
import { TotalPrice } from "./total-price";

export const TodaySalesList = async () => {
  const {
    header,
    todaySyunSalesData,
  }: { header: string; todaySyunSalesData: SyunSales[] } =
    await getTodaySyunSalesData();
  const storeNames: string[] = [
    ...new Set(todaySyunSalesData.map((item) => item.storeName)),
  ];
  const totalPrice: number = todaySyunSalesData.reduce(
    (prev, cur) => prev + cur.unitPrice * cur.quantity,
    0
  );
  return (
    <div className="flex flex-col gap-4">
      <h1 className="truncate">{header}</h1>
      <TotalPrice totalPrice={totalPrice} />
      {storeNames.map((storeName) => {
        return (
          <div key={storeName} className="flex flex-col gap-2">
            <h1 className="truncate text-xl font-semibold">{storeName}</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {todaySyunSalesData
                .filter((item) => item.storeName === storeName)
                .map((item) => {
                  return (
                    <TodaySalesCard
                      key={JSON.stringify(item)}
                      productName={item.productName}
                      quantity={item.quantity}
                      price={item.unitPrice}
                    />
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
