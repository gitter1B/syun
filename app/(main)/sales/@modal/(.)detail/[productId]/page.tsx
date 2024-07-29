import { Product, Sales, Store } from "@/lib/types";
import { DetailModal } from "../components/detail-modal";
import { getAllProducts } from "@/actions/product";
import { sheets_v4 } from "googleapis";
import { getSheets } from "@/lib/sheet";
import { getAllSales } from "@/actions/sales";
import { DetailList } from "../../../components/detail-list";
import { YearSalesChart } from "../../../components/year-sales-chart";
import { getAllStores } from "@/actions/store";
import { StoreTabs } from "@/app/(main)/components/store-tabs";
import { DetailsFilter } from "../../../components/details-filter";
import { YearSelect } from "@/app/(main)/components/year-select";
import { MonthSelect } from "@/app/(main)/components/month-select";
import { StoreSelect } from "@/app/(main)/components/store-select";
import { format } from "date-fns-tz";
import { getMonthChartData, getYearChartData } from "@/lib/date";
import { MonthSalesChart } from "../../../components/month-sales-chart";

export default async function SalesDetailsModalPage({
  params,
  searchParams,
}: {
  params: { productId: string };
  searchParams: { year: string; month: string };
}) {
  const sheets: sheets_v4.Sheets = await getSheets();
  const salesData: Sales[] = await getAllSales(sheets);
  const products: Product[] = await getAllProducts(sheets);
  const stores: Store[] = await getAllStores(sheets);
  const thisYear: number = Number(
    format(new Date(), "yyyy", {
      timeZone: "Asia/Tokyo",
    })
  );
  const years: number[] = Array.from({ length: thisYear - 2020 }).map(
    (_, i) => 2021 + i
  );
  const months: number[] = Array.from({ length: 12 }).map((_, i) => i + 1);

  const year: number = years.includes(Number(searchParams.year))
    ? Number(searchParams.year)
    : thisYear;
  const month: number = months.includes(Number(searchParams.month))
    ? Number(searchParams.month)
    : 0;
  const product: Product | undefined = await products.find(
    (p) => p.id === params.productId
  );
  const filteredData: Sales[] = salesData.filter((item) => {
    const date: Date = new Date(item.date);
    if (month > 0) {
      return (
        item.productId === params.productId &&
        year === date.getFullYear() &&
        month === date.getMonth() + 1
      );
    } else {
      return item.productId === params.productId && year === date.getFullYear();
    }
  });
  let yearChartData: { month: string; price: number }[] = [];
  let monthChartData: { day: string; price: number }[] = [];

  if (month === 0) {
    yearChartData = await getYearChartData(filteredData, year);
  } else {
    monthChartData = await getMonthChartData(filteredData, year, month);
  }

  const selectStoreIds: string[] = [
    ...new Set(filteredData.map((item) => item.storeId)),
  ].toSorted((a, b) => Number(a) - Number(b));

  const selectStores: Store[] = selectStoreIds
    .map((storeId) => stores?.find((s) => s.id === storeId))
    .filter((store): store is Store => store !== undefined);

  if (!product) {
    return <DetailModal productName={"なし"}>{null}</DetailModal>;
  }
  return (
    <DetailModal productName={product.name}>
      {month > 0 ? (
        <MonthSalesChart chartData={monthChartData} />
      ) : (
        <YearSalesChart productName={product.name} chartData={yearChartData} />
      )}
      <DetailList salesData={filteredData} />
    </DetailModal>
  );
}
