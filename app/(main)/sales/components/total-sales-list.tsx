import { TotalSales } from "@/lib/types";
import { TotalPrice } from "./total-price";
import { SalesCard } from "./sales-card";
import { Pagination } from "../../components/pagination";

type Props = {
  totalSalesData: TotalSales[];
  page: number;
};
export const TotalSalesList = ({ totalSalesData, page }: Props) => {
  const ITEMS_PER_PAGE: number = 12;
  const startPage: number = ITEMS_PER_PAGE * (page - 1);
  const endPage: number = startPage + ITEMS_PER_PAGE;

  const totalPrice: number = totalSalesData.reduce(
    (prev, cur) => prev + cur.totalPrice,
    0
  );
  if (totalSalesData.length === 0) {
    return <div>データがありません</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <TotalPrice totalPrice={totalPrice} />
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {totalSalesData
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
      </div>
      <Pagination maxPage={Math.ceil(totalSalesData.length / 12)} />
    </div>
  );
};
