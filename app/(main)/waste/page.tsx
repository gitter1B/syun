import { Suspense } from "react";
import { WasteFilter } from "./components/waste-filter";
import { WasteList } from "./components/waste-list";

export default async function WastePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const productId: string = (searchParams.productId || "all") as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const page: number = Number(searchParams.page) || 1;
  return (
    <div className="flex flex-col gap-4">
      <WasteFilter />
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>loading...</p>}>
        <WasteList productId={productId} storeId={storeId} page={page} />
      </Suspense>
    </div>
  );
}
