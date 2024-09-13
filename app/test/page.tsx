// import { TestForm } from "./components/test-form";
// import { testAction } from "./actions";

import { Button } from "@/components/ui/button";
import {
  convertProducts,
  convertSales,
  convertShipments,
} from "@/lib/convert-data";
import { appendValues, getSheets, getTables } from "@/lib/sheet";
import { Product, Sales, Shipment, Tables } from "@/lib/types";
import { sheets_v4 } from "googleapis";

export default async function TestPage() {
  // const tables: Tables = await getTables(["販売", "商品"]);
  // const products: Product[] = await convertProducts(tables["商品"].data);
  // const salesData: Sales[] = await convertSales(tables["販売"].data);
  return <div></div>;
}
