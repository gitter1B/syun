import { StoreSelect } from "@/app/(main)/components/store-select";
import { DateRangePicker } from "./date-range-picker";
import { fetchSalesFilter } from "@/lib/data/sales";

export const SalesFilter = async () => {
  const { stores } = await fetchSalesFilter();
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <DateRangePicker />
      <StoreSelect stores={stores} />
    </div>
  );
};
