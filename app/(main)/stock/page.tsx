import { Suspense } from "react";
import { StockList } from "./components/stock-list";
import { StockTable } from "./components/stock-table";

export default async function StockPage() {
  return (
    <div className="flex w-full h-full">
      <div className="flex flex-1 flex-col gap-4">
        <Suspense fallback={<p>loading...</p>}>
          {/* <StockList /> */}
          <StockTable />
        </Suspense>
      </div>
    </div>
  );
}
