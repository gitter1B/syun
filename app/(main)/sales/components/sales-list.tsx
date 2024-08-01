import { Sales, TotalSales } from "@/lib/types";
import { SalesCard } from "./sales-card";
import { getSales, getTotalSalesData } from "@/actions/sales";
import { TotalPrice } from "./total-price";
import { getToday } from "@/lib/date";
import { Pagination } from "../../components/pagination";
import { TodaySalesCard } from "./today-sales-card";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export const SalesList = async ({ searchParams }: Props) => {
  const today: string = await getToday();
  const from: string = (searchParams.from || today) as string;
  const to: string = (searchParams.to || today) as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const salesData: Sales[] = await getSales(from, to, storeId);
  const storeNames: (string | undefined)[] = [
    ...new Set(salesData.map((item) => item.storeName)),
  ];

  const totalSalesData: TotalSales[] = await getTotalSalesData(salesData);
  const page: number = Number(searchParams.page) || 1;
  const ITEMS_PER_PAGE: number = 12;
  const startPage: number = ITEMS_PER_PAGE * (page - 1);
  const endPage: number = startPage + ITEMS_PER_PAGE;
  const totalPrice: number = salesData.reduce(
    (prev, cur) => prev + cur.unitPrice * cur.quantity,
    0
  );
  if (salesData.length === 0) {
    return <div>データがありません</div>;
  }
  if (from === today && to === today) {
    return storeNames.map((storeName) => {
      return (
        <div key={storeName} className="flex flex-col gap-2">
          <h1 className="truncate text-xl font-semibold">{storeName}</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {salesData
              .filter((item) => item.storeName === storeName)
              .map((item) => {
                return (
                  <TodaySalesCard
                    key={JSON.stringify(item)}
                    productName={item.productName!}
                    quantity={item.quantity}
                    price={item.unitPrice}
                  />
                );
              })}
          </div>
        </div>
      );
    });
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <TotalPrice totalPrice={totalPrice} />
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
      <Pagination maxPage={Math.ceil(totalSalesData.length / 12)} />
    </div>
  );
};
