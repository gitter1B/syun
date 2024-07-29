import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStocks } from "@/actions/stock";
import { getTables } from "@/lib/sheet";
import { StockItem, Store } from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { convertStores } from "@/lib/convert-data";
import { StockModal } from "./stock-modal";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const StockTable = async () => {
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
  const existStores: Store[] = stores.filter((s) =>
    existStoreIds.includes(s.id)
  );
  return (
    <div>
      <Tabs defaultValue={existStoreIds.at(0)} className="w-full">
        <TabsList>
          {existStores.map((store) => {
            return (
              <TabsTrigger key={store.id} value={store.id}>
                {store.name}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {existStoreIds.map((storeId) => {
          console.log(storeId);
          return (
            <TabsContent key={storeId} value={storeId}>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">商品</TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      単価
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      残数
                    </TableHead>
                    <TableHead className="w-1/6"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {[...stocks]
                    .filter((stock) => stock.storeId === storeId)
                    .map((stock) => {
                      const { id, productName, unitPrice, quantity } = stock;
                      return (
                        quantity !== 0 && (
                          <TableRow
                            key={id}
                            className={cn(
                              "h-[76px]",
                              quantity < 0 &&
                                "bg-destructive text-destructive-foreground  hover:bg-destructive/80"
                            )}
                          >
                            <TableCell className="text-[16px] font-semibold whitespace-nowrap">
                              {productName}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              {unitPrice.toLocaleString()}円
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              {quantity.toLocaleString()}個
                            </TableCell>
                            <TableCell align="center">
                              {quantity > 0 && <StockModal stock={stock} />}
                            </TableCell>
                          </TableRow>
                        )
                      );
                    })}
                </TableBody>
              </Table>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
