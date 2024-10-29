import { Suspense } from "react";
import {
  TotalSalesCard,
  TotalSalesCardSkeleton,
} from "@/features/sales/components/total-sales-card";
import {
  StockList,
  StockListSkeleton,
} from "@/features/stocks/components/stock-list";

export const dynamic = "force-dynamic";

export default async function Dashboard({
  params,
}: {
  params: { producerId: string };
}) {
  const producerId: string = params.producerId;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">集計</h2>
        <Suspense fallback={<TotalSalesCardSkeleton />}>
          <TotalSalesCard producerId={producerId} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">残数</h1>
        <div className="p-4 border rounded-sm">
          <Suspense
            key={JSON.stringify(producerId)}
            fallback={<StockListSkeleton />}
          >
            <StockList producerId={producerId} action={false} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
