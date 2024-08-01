import { getWastes } from "@/actions/waste";
import { Waste } from "@/lib/types";
import { WasteCard } from "./waste-card";
import { Pagination } from "../../components/pagination";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export const WasteList = async ({ searchParams }: Props) => {
  const productId: string = (searchParams.productId || "all") as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const page: number = Number(searchParams.page) || 1;
  const ITEMS_PER_PAGE: number = 12;
  const startPage: number = ITEMS_PER_PAGE * (page - 1);
  const endPage: number = startPage + ITEMS_PER_PAGE;
  const wastes: Waste[] = await getWastes(productId, storeId);

  if (wastes.length === 0) {
    return <div>データがありません。</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {[...wastes].slice(startPage, endPage).map((item) => {
          return <WasteCard key={item.id} wasteItem={item} />;
        })}
      </div>
      <Pagination maxPage={Math.ceil(wastes.length / 12)} />
    </div>
  );
};
