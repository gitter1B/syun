import { Suspense } from "react";
import { SalesList } from "./components/sales-list";
import { SalesFilter } from "./components/sales-filter";
import { getToday } from "@/lib/date";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today: string = await getToday();
  const from: string = (searchParams.from || today) as string;
  const to: string = (searchParams.to || today) as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const page: number = Number(searchParams.page) || 1;

  return (
    <div className="flex flex-col gap-4 h-full">
      <SalesFilter />
      <div className="flex-1">
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <SalesList from={from} to={to} storeId={storeId} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
