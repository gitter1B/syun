import { Waste } from "@/lib/types";
import { WasteCard } from "./waste-card";
import { Pagination } from "../../components/pagination";
import { fetchWasteList } from "@/lib/data/waste";

type Props = {
  storeId: string;
  productId: string;
  page: number;
};
export const WasteList = async ({ storeId, productId, page }: Props) => {
  const ITEMS_PER_PAGE: number = 12;
  const startPage: number = ITEMS_PER_PAGE * (page - 1);
  const endPage: number = startPage + ITEMS_PER_PAGE;
  const { wastes } = await fetchWasteList();

  if (wastes.length === 0) {
    return <div>データがありません。</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {wastes.slice(startPage, endPage).map((item) => {
          return <WasteCard key={item.id} wasteItem={item} />;
        })}
      </div>
      <Pagination maxPage={Math.ceil(wastes.length / 12)} />
    </div>
  );
};
