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
import { Stock } from "@/lib/types";
import { StockModal } from "./stock-modal";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const StockTable = async () => {
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
    <Tabs defaultValue={existStoreItems.at(0)?.storeId}>
      <TabsList>
        {existStoreItems.map((store) => {
          return (
            <TabsTrigger key={store.storeId} value={store.storeId}>
              {store.storeName}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {existStoreItems.map(({ storeId }) => {
        return (
          <TabsContent key={storeId} value={storeId}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="truncate sm:w-1/2">商品</TableHead>
                  <TableHead className="text-right truncate">単価</TableHead>
                  <TableHead className="text-right truncate">残数</TableHead>
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
                          <TableCell className="text-[16px] font-semibold">
                            {productName}
                          </TableCell>
                          <TableCell className="text-right truncate">
                            {unitPrice.toLocaleString()}円
                          </TableCell>
                          <TableCell className="text-right truncate">
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
  );
};
