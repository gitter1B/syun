import { TotalPriceCard } from "./total-price-card";
import { getTotalPriceCardData } from "@/lib/data/dashboard";

export const DashboardSales = async () => {
  const { todayPriceCardData, monthPriceCardData, yearPriceCardData } =
    await getTotalPriceCardData();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold w-full border-b pb-1">集計</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TotalPriceCard {...todayPriceCardData} />
        <TotalPriceCard {...monthPriceCardData} />
        <TotalPriceCard {...yearPriceCardData} />
      </div>
    </div>
  );
};
