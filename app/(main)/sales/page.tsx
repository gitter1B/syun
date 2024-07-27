import { Suspense } from "react";
import { SalesList } from "./components/sales-list";
import { TodaySalesList } from "./components/today-sales-list";
import { SalesDateTabs } from "./components/sales-date-tabs";
import { SalesFilter } from "./components/sales-filter";
import { DateRangePicker } from "./components/date-range-picker";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { storeId: string; from: string; to: string; page: number };
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <SalesFilter />
      <div className="flex-1">
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          {/* <SalesContainer searchParams={searchParams} /> */}
          {searchParams.from && searchParams.to ? (
            <SalesList searchParams={searchParams} />
          ) : (
            <TodaySalesList />
          )}
        </Suspense>
      </div>
    </div>
  );
}
