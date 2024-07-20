import { Suspense } from "react";
import { StockList } from "./components/stock-list";

export default async function StockPage() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p>loading...</p>}>
        <StockList />
      </Suspense>
    </div>
  );
}
