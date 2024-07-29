import { getStocks } from "@/actions/stock";
import { getTables } from "@/lib/sheet";
import { StockItem, Store } from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { StockAccordion } from "./stock-accordion";
import { StockCard } from "./stock-card";
import { convertStores } from "@/lib/convert-data";

export const StockList = async () => {
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
    ...new Set(stocks.map((item) => item.storeId)),
  ].toSorted((a, b) => Number(a) - Number(b));

  return (
    <div className="flex flex-col gap-2">
      {existStoreIds.map((storeId) => {
        const storeName: string =
          stores.find((s) => s.id === storeId)?.name || "";
        const filteredStocks: StockItem[] = stocks.filter(
          (item) => item.quantity !== 0 && item.storeId === storeId
        );

        return (
          filteredStocks.length > 0 && (
            <StockAccordion
              key={storeId}
              storeId={storeId}
              storeName={storeName}
            >
              <div className="grid  lg:grid-cols-2 gap-2">
                {filteredStocks.map((item) => {
                  return <StockCard key={item.id} stock={item} />;
                })}
              </div>
            </StockAccordion>
          )
        );
      })}
    </div>
  );
};
