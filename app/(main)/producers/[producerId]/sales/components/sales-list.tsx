import { fetchSalesList } from "@/lib/data/sales";
import { TodaySalesList } from "./today-sales-list";
import { TotalSalesList } from "./total-sales-list";
import { SalesFilters } from "@/lib/types";

type Props = {
  filters: SalesFilters;
  page: number;
};
export const SalesList = async ({ filters, page }: Props) => {
  const { today, todaySalesData, totalSalesData } = await fetchSalesList(
    filters
  );

  if (filters.from === today && filters.to === today) {
    return <TodaySalesList todaySalesData={todaySalesData} />;
  }
  return <TotalSalesList totalSalesData={totalSalesData} page={page} />;
};
