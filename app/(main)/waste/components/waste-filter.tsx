import { SearchProduct } from "@/components/search-product";
import { StoreSelect } from "../../components/store-select";
import { fetchWasteFilters } from "@/lib/data/waste";

export const WasteFilter = async () => {
  const { stores, products } = await fetchWasteFilters();

  return (
    <div className="flex gap-2">
      <StoreSelect stores={stores} /> <SearchProduct products={products} />
    </div>
  );
};
