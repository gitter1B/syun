import { Product, Sales } from "@/lib/types";
import { getAllProducts } from "@/actions/product";
import { sheets_v4 } from "googleapis";
import { getSheets } from "@/lib/sheet";
import { getAllSales } from "@/actions/sales";

type Props = {
  params: { productId: string };
};

export default async function SalesDetailPage({ params }: Props) {
  const sheets: sheets_v4.Sheets = await getSheets();
  const products: Product[] = await getAllProducts(sheets);
  const product: Product | undefined = await products.find(
    (p) => p.id === params.productId
  );

  return <div>{product?.name}</div>;
}
