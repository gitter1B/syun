import { Sales } from "@/features/sales/lib/types";

export const getTotalSalesPrice = async (
  salesData: Sales[]
): Promise<number> => {
  return salesData.reduce((prev, cur) => prev + cur.totalPrice, 0);
};
