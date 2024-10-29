import { Suspense } from "react";

import { WasteFilters } from "@/features/wastes/lib/types";

import { WasteFilterGroup } from "@/features/wastes/components/waste-filter-group";
import { WasteList } from "@/features/wastes/components/waste-list";

export default async function WastesPage({
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
      <h1 className="text-2xl font-semibold">回収/廃棄</h1>
      <div className="p-4 border rounded-sm flex flex-col gap-4">
        <h2 className="w-full border-b pb-2 border-dashed">フィルタ</h2>
        <Suspense fallback={<p>loading...</p>}>
          <WasteFilterGroup />
        </Suspense>
        <span className="border-b-2 my-1" />
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<p>loading...</p>}
        >
          <WasteList filters={filters} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
