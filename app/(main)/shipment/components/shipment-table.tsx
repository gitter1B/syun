import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, Shipment, ShipmentItem, Store } from "@/lib/types";
import { OverflowMenu } from "./overflow-menu";

type Props = {
  shipments: Shipment[];
  products: Product[];
  stores: Store[];
  date: string;
  storeId: string;
};
export const ShipmentTable = async ({
  shipments,
  products,
  stores,
  date,
  storeId,
}: Props) => {
  const shipmentData: ShipmentItem[] = shipments
    .filter((item) => {
      return item.date === date && item.storeId === storeId;
    })
    .map((item) => {
      const productName: string =
        products.find((p) => p.id === item.productId)?.name || "";
      const storeName: string =
        stores.find((s) => s.id === item.storeId)?.name || "";
      return {
        ...item,
        productName: productName,
        storeName: storeName,
      };
    });
  if (shipmentData.length === 0) {
    return <p>データがありません</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">商品</TableHead>
          <TableHead className="text-right whitespace-nowrap">単価</TableHead>
          <TableHead className="text-right whitespace-nowrap">出荷数</TableHead>
          <TableHead className="w-1/6"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...shipmentData].map((item) => {
          return (
            <TableRow key={item.id}>
              <TableCell className="text-[16px] font-semibold whitespace-nowrap">
                {item.productName}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {item.unitPrice.toLocaleString()}円
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {item.quantity.toLocaleString()}個
              </TableCell>
              <TableCell align="right">
                <OverflowMenu shipmentItem={item} products={products} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
