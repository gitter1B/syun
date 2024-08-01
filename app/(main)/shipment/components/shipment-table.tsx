import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shipment } from "@/lib/types";
import { getShipments } from "@/actions/shipment";
import { getToday } from "@/lib/date";
import { ShipmentEditSheet } from "./shipment-edit-sheet";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export const ShipmentTable = async ({ searchParams }: Props) => {
  const today: string = await getToday();
  const storeId: string = (searchParams?.storeId || "1") as string;
  const date: string = (searchParams?.date || today) as string;
  const shipments: Shipment[] = await getShipments(storeId, date);

  if (shipments.length === 0) {
    return <p>データがありません</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="truncate sm:w-1/2">商品</TableHead>
          <TableHead className="text-right truncate">単価</TableHead>
          <TableHead className="text-right truncate">出荷数</TableHead>
          <TableHead className="w-1/6"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...shipments].map((item) => {
          return (
            <TableRow key={item.id} className="h-[76px]">
              <TableCell className="text-[16px] font-semibold">
                {item.productName}
              </TableCell>
              <TableCell className="text-right truncate">
                {item.unitPrice.toLocaleString()}円
              </TableCell>
              <TableCell className="text-right truncate">
                {item.quantity.toLocaleString()}個
              </TableCell>
              <TableCell align="center">
                <ShipmentEditSheet shipment={item} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
