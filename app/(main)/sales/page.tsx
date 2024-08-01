import { Suspense } from "react";
import { SalesList } from "./components/sales-list";
import { SalesFilter } from "./components/sales-filter";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <SalesFilter />
      <div className="flex-1">
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <SalesList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
