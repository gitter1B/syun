import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDashboardStock } from "@/lib/data/dashboard";

export const DashboardStock = async () => {
  const { stocks, existStoreItems } = await getDashboardStock();
  return (
    <>
      <h1 className="text-xl font-semibold w-full border-b pb-1">残数</h1>
      <Tabs
        defaultValue={existStoreItems.at(0)?.storeId || ""}
        className="w-full"
      >
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
                      <div key={id} className="p-4 border rounded-sm shadow-sm">
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
    </>
  );
};
