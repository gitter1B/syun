import { getToday } from "@/lib/date";
import { Sales, SalesFilters } from "@/lib/types";
import { DetailList } from "../../../components/detail-list";
import { convertSalesToBarChartData } from "@/lib/convert-data";
import { SalesChart } from "@/app/(main)/components/sales-chart";
import { getSalesData } from "@/lib/data/sales";

type Props = {
  filters: SalesFilters;
};
export const DetailsContainer = async ({ filters }: Props) => {
  const salesData: Sales[] = await getSalesData(filters);
  console.log(salesData);
  const chartData: { date: string; price: number }[] =
    await convertSalesToBarChartData(salesData);
  const sortedSalesData: Sales[] = salesData.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <div>
      <SalesChart chartData={chartData} />
      <DetailList salesData={sortedSalesData} />
    </div>
  );
};
