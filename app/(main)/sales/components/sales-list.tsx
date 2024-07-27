import { SalesItem, TotalSales } from "@/lib/types";
import { SalesCard } from "./sales-card";
import { getSalesData, getTotalSalesData } from "@/actions/sales";
import { Pagination } from "@/components/pagination";
import { TotalPrice } from "./total-price";

type Props = {
  searchParams: { storeId: string; from: string; to: string; page: number };
};
export const SalesList = async ({ searchParams }: Props) => {
  const storeId: string = searchParams.storeId || "all";
  const salesData: SalesItem[] = await getSalesData(
    storeId,
    searchParams.from,
    searchParams.to
  );
  const totalSalesData: TotalSales[] = await getTotalSalesData(salesData);
  const page: number = Number(searchParams.page) || 1;
  const ITEMS_PER_PAGE: number = 12;
  const startPage: number = ITEMS_PER_PAGE * (page - 1);
  const endPage: number = startPage + ITEMS_PER_PAGE;
  const totalPrice: number = salesData.reduce(
    (prev, cur) => prev + cur.unitPrice * cur.quantity,
    0
  );
  return (
    <div className="w-full grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      <TotalPrice totalPrice={totalPrice} />
      {[...totalSalesData]
        .slice(startPage, endPage)
        .map(({ productId, productName, totalPrice, totalQuantity }) => {
          return (
            totalPrice > 0 && (
              <SalesCard
                key={productName}
                productId={productId}
                productName={productName}
                price={totalPrice}
                quantity={totalQuantity}
              />
            )
          );
        })}
      <Pagination maxPage={Math.ceil(totalSalesData.length / 12)} />
    </div>
  );
};
