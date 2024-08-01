import { TotalPriceCard } from "./components/total-price-card";
import { getSalesTotalPrice } from "@/actions/sales";
import { Stock } from "@/lib/types";
import { getStocks } from "@/actions/stock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getSales } from "@/actions/sales";
import { getToday } from "@/lib/date";
import { Sales } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const today = await getToday();
  const [year, month, day] = today.split("-");
  const thisYear: number = Number(year);
  const thisMonth: number = parseInt(month);

  const yearSalesData: Sales[] = await getSales(
    `${thisYear}-01-01`,
    `${thisYear}-12-31`
  );

  const monthSalesData: Sales[] = yearSalesData.filter((item) => {
    return (
      new Date(thisYear, thisMonth - 1, 1).getTime() <=
        new Date(item.date).getTime() &&
      new Date(item.date).getTime() <=
        new Date(thisYear, thisMonth, 1).getTime()
    );
  });

  const todaySalesData: Sales[] = yearSalesData.filter(
    (item) => item.date === today
  );

  const todayTotalPrice: number = await getSalesTotalPrice(todaySalesData);
  const monthTotalPrice: number = await getSalesTotalPrice(monthSalesData);
  const yearTotalPrice: number = await getSalesTotalPrice(yearSalesData);

  const stocks: Stock[] = await getStocks();
  const existStoreItems: { storeId: string; storeName: string }[] = stocks
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.storeId === item.storeId)
    )
    .map((item) => ({
      storeId: item.storeId,
      storeName: item.storeName!,
    }))
    .toSorted((a, b) => Number(a.storeId) - Number(b.storeId));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold w-full border-b pb-1">集計</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TotalPriceCard title="今日の集計" totalPrice={todayTotalPrice} />
          <TotalPriceCard title="今月の集計" totalPrice={monthTotalPrice} />
          <TotalPriceCard title="今年の集計" totalPrice={yearTotalPrice} />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-semibold mb-2 w-full border-b pb-1">
          残数
        </h1>
        <Tabs defaultValue={existStoreItems.at(0)?.storeId} className="w-full">
          <TabsList>
            {existStoreItems.map(({ storeId, storeName }) => {
              return (
                <TabsTrigger key={storeId} value={storeId}>
                  {storeName}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {existStoreItems.map(({ storeId }) => {
            return (
              <TabsContent key={storeId} value={storeId}>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {stocks
                    .filter((stock) => stock.storeId === storeId)
                    .map(({ id, productName, unitPrice, quantity }) => {
                      return (
                        <div
                          key={id}
                          className="p-4 border rounded-sm shadow-sm"
                        >
                          <div className="truncate font-semibold">
                            {productName}
                          </div>
                          <div className="truncate text-right">
                            {unitPrice.toLocaleString()}円
                          </div>
                          <div className="truncate text-right">
                            {quantity.toLocaleString()}袋
                          </div>
                        </div>
                      );
                    })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
