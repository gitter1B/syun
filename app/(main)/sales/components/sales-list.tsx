import { TotalSales } from "@/lib/types";
import { SalesCard } from "./sales-card";

type Props = {
  resultData: TotalSales[];
};

export const SalesList = async ({ resultData }: Props) => {
  return (
    <div className="w-full grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {resultData.map(
        ({ productId, productName, totalPrice, totalQuantity }) => {
          return (
            totalPrice > 0 && (
              <SalesCard
                key={productName}
                productId={productId}
                productName={productName}
                totalPrice={totalPrice}
                totalQuantity={totalQuantity}
              />
            )
          );
        }
      )}
    </div>
  );
};
