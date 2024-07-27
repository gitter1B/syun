import { getAllProducts } from "@/actions/product";
import { getSalesData, getTodaySyunSalesData } from "@/actions/sales";
import { getAllStores } from "@/actions/store";
import { getSheets } from "@/lib/sheet";
import { Sales, SyunSales } from "@/lib/types";
import { TodaySalesList } from "../(main)/sales/components/today-sales-list";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  // const todaySyunSales: SyunSales[] = await getTodaySyunSalesData();
  // console.log(todaySyunSales);
  // const sheets = await getSheets();
  // const products = await getAllProducts(sheets);
  // const stores = await getAllStores(sheets);
  // console.log(todaySyunSales.map((item) => item.productName));
  // const todaySalesData: Sales[] = todaySyunSales.map((item, index) => {
  //   const productId: string =
  //     products.find((p) => p.name === item.productName)?.id || "a";
  //   console.log(productId === "a" && item.productName);
  //   const storeId: string =
  //     stores.find((s) => s.name === item.storeName)?.id || "a";
  //   return {
  //     id: (index + 1).toString(),
  //     date: item.date,
  //     productId: productId,
  //     unitPrice: item.unitPrice,
  //     quantity: item.quantity,
  //     storeId: storeId,
  //   };
  // });
  return (
    <div className="">
      <TodaySalesList />
    </div>
  );
}
