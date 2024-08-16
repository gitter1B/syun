import { getToday } from "@/lib/date";
import { Sales, Stock } from "@/lib/types";
import { getSalesData } from "@/lib/data/sales";
import {
  convertSalesToBarChartData,
  convertSalesToPieChartData,
} from "@/lib/convert-data";
import { getStocks } from "./stock";

type PriceCard = {
  title: string;
  totalPrice: number;
  barChartData?: {
    date: string;
    price: number;
  }[];
  pieChartData?: {
    productName: string;
    price: number;
    fill: string;
  }[];
};
export const getTotalPriceCardData = async (): Promise<{
  todayPriceCardData: PriceCard;
  monthPriceCardData: PriceCard;
  yearPriceCardData: PriceCard;
}> => {
  const today = await getToday();
  const [year, month, day] = today.split("-");
  const thisYear: number = Number(year);
  const thisMonth: number = parseInt(month);

  const yearSalesData: Sales[] = await getSalesData({
    from: `${thisYear}-01-01`,
    to: `${thisYear}-12-31`,
  });
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

  const monthBarChartData: { date: string; price: number }[] =
    await convertSalesToBarChartData(monthSalesData);
  const yearBarChartData: { date: string; price: number }[] =
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
  return {
    todayPriceCardData: {
      title: "今日の集計",
      totalPrice: todayTotalPrice,
      pieChartData: todayPieChartData,
    },
    monthPriceCardData: {
      title: "今月の集計",
      totalPrice: monthTotalPrice,
      barChartData: monthBarChartData,
      pieChartData: monthPieChartData,
    },
    yearPriceCardData: {
      title: "今年の集計",
      totalPrice: yearTotalPrice,
      barChartData: yearBarChartData,
      pieChartData: yearPieChartData,
    },
  };
};

const getSalesTotalPrice = async (salesData: Sales[]): Promise<number> => {
  return salesData.reduce((prev, cur) => prev + cur.totalPrice, 0);
};

export const getDashboardStock = async (): Promise<{
  stocks: Stock[];
  existStoreItems: { storeId: string; storeName: string }[];
}> => {
  const stocks: Stock[] = await getStocks();
  const existStoreItems: { storeId: string; storeName: string }[] = stocks
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.storeId === item.storeId)
    )
    .map((item) => ({
      storeId: item.storeId,
      storeName: item.storeName!,
    }))
    .toSorted((a, b) => Number(a.storeId) - Number(b.storeId));
  return {
    stocks,
    existStoreItems,
  };
};
