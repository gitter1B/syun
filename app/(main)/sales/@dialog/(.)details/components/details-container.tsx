import { getToday } from "@/lib/date";
import { Sales } from "@/lib/types";
import { DetailList } from "../../../components/detail-list";
import { convertSalesToBarChartData } from "@/lib/convert-data";
import { SalesChart } from "@/app/(main)/components/sales-chart";
import { getSalesData } from "@/lib/data/sales";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export const DetailsContainer = async ({ searchParams }: Props) => {
  const today: string = await getToday();
  const from: string = (searchParams.from || today) as string;
  const to: string = (searchParams.to || today) as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const productId: string = (searchParams.productId || "all") as string;
  const salesData: Sales[] = await getSalesData({
    from,
    to,
    storeId,
    productId,
  });
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
