import { fetchSalesList } from "@/lib/data/sales";
import { TodaySalesList } from "./today-sales-list";
import { TotalSalesList } from "./total-sales-list";

type Props = {
  from: string;
  to: string;
  storeId: string;
  page: number;
};
export const SalesList = async ({ from, to, storeId, page }: Props) => {
  const { today, todaySalesData, totalSalesData } = await fetchSalesList({
    storeId,
    from,
    to,
  });

  if (from === today && to === today) {
    return <TodaySalesList todaySalesData={todaySalesData} />;
  }
  return <TotalSalesList totalSalesData={totalSalesData} page={page} />;
};
