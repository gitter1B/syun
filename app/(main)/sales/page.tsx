import { Suspense } from "react";
import { SalesSearchParams, Store } from "@/lib/types";
import { SalesFilter } from "./components/sales-filter";
import { SalesContainer } from "./components/sales-container";
import { StoreSelect } from "../components/store-select";
import { YearSelect } from "../components/year-select";
import { MonthSelect } from "../components/month-select";
import { sheets_v4 } from "googleapis";
import { getSheets } from "@/lib/sheet";
import { getAllStores } from "@/actions/store";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: SalesSearchParams;
}) {
  const sheets: sheets_v4.Sheets = await getSheets();
  const stores: Store[] = await getAllStores(sheets);
  return (
    <div className="flex flex-col gap-4 h-full">
      <SalesFilter>
        <div className="flex flex-col gap-3">
          <StoreSelect stores={stores} resetPage={true} />
          <div className="grid grid-cols-2 gap-2">
            <YearSelect resetPage={true} />
            <MonthSelect resetPage={true} />
          </div>
        </div>
      </SalesFilter>
      <div className="flex-1">
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <SalesContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
