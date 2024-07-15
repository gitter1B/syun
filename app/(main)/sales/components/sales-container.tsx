import { getAllProducts } from "@/actions/product";
import {
  getAllSales,
  getFilteredSalesData,
  getTotalSalesData,
} from "@/actions/sales";
import { getAllStores } from "@/actions/store";
import { getSheets } from "@/lib/sheet";
import {
  Product,
  Sales,
  SalesSearchParams,
  Store,
  TotalSales,
} from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { SalesList } from "./sales-list";
import { SalesPagination } from "./sales-pagination";

type Props = {
  searchParams: SalesSearchParams;
};

export const SalesContainer = async ({ searchParams }: Props) => {
  const page: number = Number(searchParams.page) || 1;
  const sheets: sheets_v4.Sheets = await getSheets();
  const salesData: Sales[] = await getAllSales(sheets);

  const stores: Store[] = await getAllStores(sheets);
  const products: Product[] = await getAllProducts(sheets);
  const filteredSalesData: Sales[] = await getFilteredSalesData(
    salesData,
    searchParams,
    stores
  );
  const resultData: TotalSales[] = await getTotalSalesData(
    filteredSalesData,
    products
  );
  const totalPrice: number = resultData.reduce(
    (prev, cur) => prev + cur.totalPrice,
    0
  );
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="text-xl flex justify-end gap-4 border-b border-secondary-foreground pb-2">
        <span>合計</span>
        <div className="font-semibold">{totalPrice.toLocaleString()}円</div>
      </div>
      <SalesList resultData={resultData.slice((page - 1) * 12, 12 * page)} />
      <SalesPagination maxPage={Math.ceil(resultData.length / 12)} />
    </div>
  );
};
