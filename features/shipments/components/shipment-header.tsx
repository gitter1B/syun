import { fetchShipmentHeader } from "@/features/shipments/lib/fetcher";

import { ShipmentStoreSelect } from "@/features/shipments/components/shipment-store-select";
import { ShipmentDatePicker } from "@/features/shipments/components/shipment-date-picker";
import { CreateShipment } from "@/features/shipments/components/create-shipment";

export const ShipmentHeader = async () => {
  const { stores, recentProducts, shipments, existDates } =
    await fetchShipmentHeader();
  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="grid grid-cols-2 gap-2">
        <ShipmentStoreSelect stores={stores} shipments={shipments} />
        <ShipmentDatePicker existDates={existDates} />
      </div>
      <CreateShipment />
    </div>
  );
};
