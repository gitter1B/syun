import { Suspense } from "react";
import { DashboardStock } from "./components/dashboard-stock";
import { DashboardStockSkeleton } from "./components/dashboard-stock-skeleton";
import { DashboardSales } from "./components/dashboard-sales";
import { DashboardSalesSkeleton } from "./components/dashboard-sales-skeleton";

export const dynamic = "force-dynamic";

export default async function Dashboard({
  params,
}: {
  params: { producerId: string };
}) {
  const producerId: string = params.producerId;
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<DashboardSalesSkeleton />}>
        <DashboardSales producerId={producerId} />
      </Suspense>
      <Suspense fallback={<DashboardStockSkeleton />}>
        <DashboardStock producerId={producerId} />
      </Suspense>
    </div>
  );
}
