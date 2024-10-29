import { cn } from "@/lib/utils";

import { fetchStockTable } from "@/features/stocks/lib/fetcher";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditStock } from "@/features/stocks/components/edit-stock";

type Props = {
  producerId: string;
  action?: boolean;
};
export const StockList = async ({ producerId, action = true }: Props) => {
  const { stocks, existStoreItems } = await fetchStockTable(producerId);
  return (
    <Tabs
      defaultValue={existStoreItems.at(0)?.storeId}
      className="flex flex-col gap-2"
    >
      <div className="flex items-start">
        <TabsList>
          {existStoreItems.map((store) => {
            return (
              <TabsTrigger key={store.storeId} value={store.storeId}>
                {store.storeName}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <span className="border-dashed border-b-2 my-1" />
      {existStoreItems.map(({ storeId }) => {
        return (
          <TabsContent key={storeId} value={storeId}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="truncate sm:w-1/2">商品</TableHead>
                  <TableHead className="text-right truncate">単価</TableHead>
                  <TableHead className="text-right truncate">残数</TableHead>
                  {action && <TableHead className="w-1/6"></TableHead>}
                </TableRow>
              </TableHeader>

              <TableBody>
                {stocks
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
                          {action && (
                            <TableCell align="center">
                              {quantity > 0 && <EditStock stock={stock} />}
                            </TableCell>
                          )}
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

import { Skeleton } from "@/components/ui/skeleton";

export const StockListSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-start">
          <Skeleton className="h-10 w-40" />
        </div>
        <span className="border-dashed border-b-2 my-1 w-full" />
        <div className="flex flex-col">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <div key={index} className="h-[76px] border-b flex items-center">
                <Skeleton className="h-12 w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
