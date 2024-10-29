import { Suspense } from "react";

import {
  StockList,
  StockListSkeleton,
} from "@/features/stocks/components/stock-list";

export default async function StockPage({
  params,
}: {
  params: { producerId: string };
}) {
  const producerId: string = params.producerId;
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-semibold">残数</h1>
      <div className="p-4 border rounded-sm">
        <Suspense key={producerId} fallback={<StockListSkeleton />}>
          <StockList producerId={producerId} />
        </Suspense>
      </div>
    </div>
  );
}
