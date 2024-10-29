import { ShipmentFilters } from "@/features/shipments/lib/types";

import { fetchShipmentTable } from "@/features/shipments/lib/fetcher";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditShipment } from "@/features/shipments/components/edit-shipment";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  filters: ShipmentFilters;
};

export const ShipmentList = async ({ filters }: Props) => {
  const { shipments } = await fetchShipmentTable(filters);

  if (shipments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-72">
        <p>データがありません</p>
      </div>
    );
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
                <EditShipment shipment={item} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export const ShipmentListSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, index) => {
        return (
          <div
            key={index}
            className="border-b h-[72px] w-full flex items-center"
          >
            <Skeleton className="w-full h-12" />
          </div>
        );
      })}
    </div>
  );
};
