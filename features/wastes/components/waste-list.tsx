import { WasteFilters } from "@/features/wastes/lib/types";

import { fetchWasteList } from "@/features/wastes/lib/fetcher";

import { Pagination } from "@/components/pagination";
import { WasteCard } from "@/features/wastes/components/waste-card";

type Props = {
  filters: WasteFilters;
  page: number;
};

export const WasteList = async ({ filters, page }: Props) => {
  const ITEMS_PER_PAGE: number = 12;
  const startPage: number = ITEMS_PER_PAGE * (page - 1);
  const endPage: number = startPage + ITEMS_PER_PAGE;
  const { wastes } = await fetchWasteList(filters);

  if (wastes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-72">
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {wastes.slice(startPage, endPage).map((item) => {
          return <WasteCard key={item.id} wasteItem={item} />;
        })}
      </div>
      <Pagination totalPages={Math.ceil(wastes.length / 12)} />
    </div>
  );
};
