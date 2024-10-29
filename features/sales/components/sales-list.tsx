import { SalesFilters } from "@/features/sales/lib/types";

import { fetchSalesList } from "@/features/sales/lib/fetcher";

import { SalesListItem } from "@/features/sales/components/sales-list-item";
import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  filters: SalesFilters;
  page: number;
};

export const SalesList = async ({ filters, page }: Props) => {
  const { totalSalesPrice, totalSalesData } = await fetchSalesList(filters);

  const startIndex = (page - 1) * 12;
  if (totalSalesData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-72">
        データがありません。
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end pr-6">
          <span className="mr-2">合計</span>
          <div className="text-xl font-semibold">
            {totalSalesPrice.toLocaleString()}
          </div>
          <span>円</span>
        </div>

        <div className="flex flex-col gap-4">
          {totalSalesData
            .slice(startIndex, startIndex + 12)
            .map(({ product, totalPrice, totalQuantity, details }) => {
              return (
                <SalesListItem
                  key={product.id}
                  product={product}
                  totalPrice={totalPrice}
                  totalQuantity={totalQuantity}
                  details={details}
                />
              );
            })}
        </div>
        <Pagination totalPages={Math.ceil(totalSalesData.length / 12)} />
      </div>
    </div>
  );
};

export const SalesListSkeleton = () => {
  return (
    <div>
      <div className="w-full flex justify-end mb-2">
        <Skeleton className="w-32 h-10" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => {
        return (
          <div
            key={index}
            className="border-b h-[72px] w-full flex items-center"
          >
            <Skeleton className="w-full h-12" />
          </div>
        );
      })}
    </div>
  );
};
