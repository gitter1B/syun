import { sheets_v4 } from "googleapis";
import { getSheets } from "@/lib/sheet";
import { Store } from "@/lib/types";
import { getAllStores } from "@/actions/store";
import { DateRangePicker } from "./date-range-picker";
import { SearchSelect } from "../../components/search-select";

export const SalesFilter = async () => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const stores: Store[] = await getAllStores(sheets);
  const storeItems: { value: string; label: string }[] = [
    { value: "all", label: "全店舗" },
    ...stores.map((s) => {
      return { value: s.id, label: s.name };
    }),
  ];
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <DateRangePicker />
      <SearchSelect
        items={storeItems}
        name="storeId"
        placeholder="店舗を選択"
      />
    </div>
  );
};
