import { fetchWasteFilters } from "@/features/wastes/lib/fetcher";

import { StoreSelect } from "@/features/stores/components/store-select";
import { ProductSelect } from "@/features/products/components/product-select";
import { Label } from "@/components/ui/label";

export const WasteFilterGroup = async () => {
  const { stores, products } = await fetchWasteFilters();

  return (
    <div className="grid grid-cols-2 gap-4 sm:flex">
      <div className="flex flex-col gap-2">
        <Label>店舗</Label>
        <StoreSelect stores={stores} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>商品</Label>
        <ProductSelect products={products} />
      </div>
    </div>
  );
};
