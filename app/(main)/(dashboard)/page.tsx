import { TotalPriceCard } from "./components/total-price-card";
import { SalesItem, StockItem, Store } from "@/lib/types";
import { getSalesData, getSalesTotalPrice } from "@/actions/sales";
import { format, formatInTimeZone } from "date-fns-tz";
import { getStocks } from "@/actions/stock";
import { sheets_v4 } from "googleapis";
import { getTables } from "@/lib/sheet";
import { convertStores } from "@/lib/convert-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const now: Date = new Date();
  const today: string = formatInTimeZone(now, "Asia/Tokyo", "yyyy-MM-dd");
  const [year, month, day] = today.split("-");
  const thisYear: number = Number(year);
  const thisMonth: number = parseInt(month);

  const yearSalesData: SalesItem[] = await getSalesData(
    "all",
    `${thisYear}-01-01`,
    `${thisYear}-12-31`
  );

  const monthSalesData: SalesItem[] = yearSalesData.filter(
    (item) =>
      new Date(thisYear, thisMonth - 1, 1).getTime() <=
        new Date(item.date).getTime() &&
      new Date(item.date).getTime() < new Date(thisYear, thisMonth, 1).getTime()
  );
  const todaySalesData: SalesItem[] = yearSalesData.filter(
    (item) => new Date(today).getTime() === new Date(item.date).getTime()
  );
  const yearTotalPrice: number = await getSalesTotalPrice(yearSalesData);
  const monthTotalPrice: number = await getSalesTotalPrice(monthSalesData);
  const todayTotalPrice: number = await getSalesTotalPrice(todaySalesData);

  const data: sheets_v4.Schema$ValueRange[] | undefined = await getTables([
    "商品",
    "店舗",
    "出荷",
    "販売",
    "廃棄",
  ]);
  const stocks: StockItem[] = await getStocks(data);
  const stores: Store[] = await convertStores(data[1].values);
  const existStoreIds: string[] = [
    ...new Set(stocks.map((stock) => stock.storeId)),
  ];
  const existStores: Store[] = stores.filter((s) =>
    existStoreIds.includes(s.id)
  );

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
        <Tabs defaultValue={existStoreIds.at(0)} className="w-full">
          <TabsList>
            {existStores.map(({ id, name }) => {
              return (
                <TabsTrigger key={id} value={id}>
                  {name}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {existStores.map((store) => {
            return (
              <TabsContent key={store.id} value={store.id}>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {stocks
                    .filter((stock) => stock.storeId === store.id)
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
