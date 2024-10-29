import { Suspense } from "react";

import { SalesFilters } from "@/features/sales/lib/types";

import { getToday } from "@/lib/date";

import {
  SalesFilterGroup,
  SalesFilterGroupSkeleton,
} from "@/features/sales/components/sales-filter-group";
import {
  SalesList,
  SalesListSkeleton,
} from "@/features/sales/components/sales-list";

export default async function SalesPage({
  params,
  searchParams,
}: {
  params: { producerId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const producerId: string = params.producerId;
  const today: string = await getToday();
  const from: string = (searchParams.from || today) as string;
  const to: string = (searchParams.to || today) as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const page: number = Number(searchParams.page) || 1;
  const filters: SalesFilters = {
    producerId,
    storeId,
    from,
    to,
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">売上</h1>
      <div className="flex flex-col gap-4 border rounded-sm p-4">
        <Suspense fallback={<SalesFilterGroupSkeleton />}>
          <SalesFilterGroup />
        </Suspense>
        <span className="border-b-2 my-1" />
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<SalesListSkeleton />}
        >
          <SalesList filters={filters} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
