import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShipmentEditSheet } from "./shipment-edit-sheet";
import { getShipments } from "@/lib/data/shipment";
import { ShipmentFilters } from "@/lib/types";

type Props = {
  producerId?: string;
  storeId?: string;
  date?: string;
};
export const ShipmentTable = async ({ producerId, storeId, date }: Props) => {
  const { shipments } = await getShipments({
    producerId,
    storeId,
    date,
  });

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
        {shipments.map((item) => {
          return (
            <TableRow key={item.id} className="h-[76px]">
              <TableCell className="text-[16px] font-semibold">
                {item.product?.name}
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
