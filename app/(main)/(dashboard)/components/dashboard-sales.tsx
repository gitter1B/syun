import { TotalPriceCard } from "./total-price-card";
import { getSalesTotalPrice } from "@/actions/sales";

import { getSales } from "@/actions/sales";
import {
  convertSalesToBarChartData,
  convertSalesToPieChartData,
} from "@/lib/convert-data";
import { getToday } from "@/lib/date";
import { Sales } from "@/lib/types";

export const DashboardSales = async () => {
  const today = await getToday();
  const [year, month, day] = today.split("-");
  const thisYear: number = Number(year);
  const thisMonth: number = parseInt(month);

  const yearSalesData: Sales[] = await getSales(
    `${thisYear}-01-01`,
    `${thisYear}-12-31`
  );

  const monthSalesData: Sales[] = yearSalesData.filter((item) => {
    return (
      new Date(thisYear, thisMonth - 1, 1).getTime() <=
        new Date(item.date).getTime() &&
      new Date(item.date).getTime() <=
        new Date(thisYear, thisMonth, 1).getTime()
    );
  });

  const todaySalesData: Sales[] = yearSalesData.filter(
    (item) => item.date === today
  );

  const todayTotalPrice: number = await getSalesTotalPrice(todaySalesData);
  const monthTotalPrice: number = await getSalesTotalPrice(monthSalesData);
  const yearTotalPrice: number = await getSalesTotalPrice(yearSalesData);

  const monthSalesChartData: { date: string; price: number }[] =
    await convertSalesToBarChartData(monthSalesData);
  const yearSalesChartData: { date: string; price: number }[] =
    await convertSalesToBarChartData(yearSalesData);
  const todayPieChartData: {
    productName: string;
    price: number;
    fill: string;
  }[] = await convertSalesToPieChartData(todaySalesData);
  const monthPieChartData: {
    productName: string;
    price: number;
    fill: string;
  }[] = await convertSalesToPieChartData(monthSalesData);
  const yearPieChartData: {
    productName: string;
    price: number;
    fill: string;
  }[] = await convertSalesToPieChartData(yearSalesData);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold w-full border-b pb-1">集計</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TotalPriceCard
          title="今日の集計"
          totalPrice={todayTotalPrice}
          pieChartData={todayPieChartData}
        />
        <TotalPriceCard
          title="今月の集計"
          totalPrice={monthTotalPrice}
          barChartData={monthSalesChartData}
          pieChartData={monthPieChartData}
        />
        <TotalPriceCard
          title="今年の集計"
          totalPrice={yearTotalPrice}
          barChartData={yearSalesChartData}
          pieChartData={yearPieChartData}
        />
      </div>
    </div>
  );
};
