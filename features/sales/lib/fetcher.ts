import "server-only";

import { cache } from "react";

import { Store } from "@/features/stores/lib/types";
import { Sales, SalesFilters, TotalSales } from "@/features/sales/lib/types";

import { getToday } from "@/lib/date";

import { getTotalSalesPrice } from "@/features/sales/lib/utils";

import { getAllStores } from "@/features/stores/lib/data";
import { getSalesData } from "@/features/sales/lib/data";

export const fetchSalesFilter = cache(
  async (): Promise<{ stores: Store[] }> => {
    const stores: Store[] = await getAllStores();
    return { stores };
  }
);

export const fetchSalesList = cache(
  async (
    filters: SalesFilters
  ): Promise<{ totalSalesPrice: number; totalSalesData: TotalSales[] }> => {
    const salesData: Sales[] = await getSalesData(filters);

    const productMap = new Map<string, TotalSales>();

    salesData.forEach((sale) => {
      const productKey = sale.productId;
      const productEntry = productMap.get(productKey) || {
        product: sale.product!,
        totalQuantity: 0,
        totalPrice: 0,
        details: [],
      };

      let detail = productEntry.details.find(
        (d) => d.unitPrice === sale.unitPrice
      );

      if (!detail) {
        detail = { unitPrice: sale.unitPrice, totalQuantity: 0, totalPrice: 0 };
        productEntry.details.push(detail);
      }

      detail.totalQuantity += sale.quantity;
      detail.totalPrice += sale.totalPrice;

      productEntry.totalQuantity += sale.quantity;
      productEntry.totalPrice += sale.totalPrice;

      productMap.set(productKey, productEntry);
    });

    const sortedProducts = Array.from(productMap.values()).sort(
      (a, b) => b.totalPrice - a.totalPrice
    );

    sortedProducts.forEach((product) => {
      product.details.sort((a, b) => b.totalPrice - a.totalPrice);
    });

    const totalSalesPrice = sortedProducts.reduce(
      (sum, product) => sum + product.totalPrice,
      0
    );

    return { totalSalesPrice, totalSalesData: sortedProducts };
  }
);

export const fetchTotalSalesCardData = cache(
  async (
    producerId: string
  ): Promise<{
    todayTotalSalesPrice: number;
    monthTotalSalesPrice: number;
    yearTotalSalesPrice: number;
  }> => {
    const sales: Sales[] = await getSalesData();

    const today = await getToday();
    const [year, month, day] = today.split("-");
    const thisYear: number = Number(year);
    const thisMonth: number = parseInt(month);

    const yearSalesData: Sales[] = await getSalesData({
      producerId,
      from: `${thisYear}-01-01`,
      to: `${thisYear}-12-31`,
    });
    const monthSalesData: Sales[] = yearSalesData.filter((item) => {
      return (
        new Date(thisYear, thisMonth - 1, 1).getTime() <=
          new Date(item.date).getTime() &&
        new Date(item.date).getTime() <=
          new Date(thisYear, thisMonth, 1).getTime()
      );
    });

    const todaySalesData: Sales[] = yearSalesData.filter(
      (item) => item.date === today
    );

    const todayTotalSalesPrice: number = await getTotalSalesPrice(
      todaySalesData
    );
    const monthTotalSalesPrice: number = await getTotalSalesPrice(
      monthSalesData
    );
    const yearTotalSalesPrice: number = await getTotalSalesPrice(yearSalesData);
    return {
      todayTotalSalesPrice,
      monthTotalSalesPrice,
      yearTotalSalesPrice,
    };
  }
);
