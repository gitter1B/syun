import { fetchTotalSalesCardData } from "@/features/sales/lib/fetcher";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  producerId: string;
};
export const TotalSalesCard = async ({ producerId }: Props) => {
  const { todayTotalSalesPrice, monthTotalSalesPrice, yearTotalSalesPrice } =
    await fetchTotalSalesCardData(producerId);
  return (
    <div className="p-4 border rounded-sm shadow-sm max-w-[400px]">
      <Tabs defaultValue="today" className="flex flex-col gap-2">
        <div className="flex items-center justify-start">
          <TabsList>
            <TabsTrigger value="today">今日</TabsTrigger>
            <TabsTrigger value="month">今月</TabsTrigger>
            <TabsTrigger value="year">今年</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-end justify-end gap-1">
          <div className="text-2xl font-semibold">
            <TabsContent value="today">
              {todayTotalSalesPrice.toLocaleString()}
            </TabsContent>
            <TabsContent value="month">
              {monthTotalSalesPrice.toLocaleString()}
            </TabsContent>
            <TabsContent value="year">
              {yearTotalSalesPrice.toLocaleString()}
            </TabsContent>
          </div>
          <span>円</span>
        </div>
      </Tabs>
    </div>
  );
};

export const TotalSalesCardSkeleton = () => {
  return <Skeleton className="w-[400px] h-32" />;
};
