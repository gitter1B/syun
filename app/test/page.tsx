// import { TestForm } from "./components/test-form";
// import { testAction } from "./actions";

import { convertProducts, convertSales } from "@/lib/convert-data";
import { getTables } from "@/lib/sheet";
import { Product, Sales, Tables } from "@/lib/types";

export default async function TestPage() {
  // const tables: Tables = await getTables(["販売", "商品"]);
  // const products: Product[] = await convertProducts(tables["商品"].data);
  // const salesData: Sales[] = await convertSales(tables["販売"].data);
  return (
    <div className="flex items-center justify-center p-8 h-dvh">
      {/* <TestForm action={testAction} /> */}
    </div>
  );
}
