import { Suspense } from "react";
import { StockTable } from "./components/stock-table";

export default async function StockPage() {
  return (
    <div className="flex w-full h-full">
      <div className="flex flex-1 flex-col gap-4">
        <Suspense fallback={<p>loading...</p>}>
          <StockTable />
        </Suspense>
      </div>
    </div>
  );
}
