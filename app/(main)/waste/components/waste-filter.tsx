import { sheets_v4 } from "googleapis";
import { getSheets } from "@/lib/sheet";
import { Item, Product, Store } from "@/lib/types";
import { getAllStores } from "@/actions/store";
import { SearchSelect } from "@/app/(main)/components/search-select";
import { getAllProducts } from "@/actions/product";
import { SearchProduct } from "@/components/search-product";

export const WasteFilter = async () => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const stores: Store[] = await getAllStores(sheets);
  const products: Product[] = await getAllProducts(sheets);
  const storeItems: { value: string; label: string }[] = [
    { value: "all", label: "全店舗" },
    ...stores.map(({ id, name }) => {
      return {
        value: id,
        label: name,
      };
    }),
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      <SearchSelect
        name="storeId"
        placeholder="店舗を選択してください。"
        items={storeItems}
      />
      <SearchProduct products={products} />
    </div>
  );
};
