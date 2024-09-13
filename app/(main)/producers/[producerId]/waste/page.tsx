import { Suspense } from "react";
import { WasteFilter } from "./components/waste-filter";
import { WasteList } from "./components/waste-list";
import { WasteFilters } from "@/lib/types";

export default async function WastePage({
  params,
  searchParams,
}: {
  params: { producerId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const producerId: string = params.producerId;
  const productId: string = (searchParams.productId || "all") as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const page: number = Number(searchParams.page) || 1;
  const filters: WasteFilters = {
    producerId,
    productId,
    storeId,
  };
  return (
    <div className="flex flex-col gap-4">
      <WasteFilter />
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>loading...</p>}>
        <WasteList filters={filters} page={page} />
      </Suspense>
    </div>
  );
}
