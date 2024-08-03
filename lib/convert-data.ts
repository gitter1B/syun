import { Product, Sales, Shipment, Store, SyunSales, Waste } from "./types";

export const convertProducts = async (
  values: string[][] | null | undefined
): Promise<Product[]> => {
  return values
    ? values.map((row) => {
        return {
          id: row[0],
          name: row[1],
        };
      })
    : [];
};

export const convertStores = async (
  values: string[][] | null | undefined
): Promise<Store[]> => {
  return values
    ? values.map((row) => {
        return {
          id: row[0],
          name: row[1],
        };
      })
    : [];
};

export const convertShipments = async (
  values: string[][] | null | undefined
): Promise<Shipment[]> => {
  return values
    ? values.map((row) => {
        return {
          id: row[0],
          date: row[1],
          productId: row[2],
          unitPrice: Number(row[3]),
          quantity: Number(row[4]),
          storeId: row[5],
        };
      })
    : [];
};

export const convertSales = async (
  values: string[][] | null | undefined
): Promise<Sales[]> => {
  return values
    ? values.map((row) => {
        return {
          id: row[0],
          date: row[1],
          productId: row[2],
          unitPrice: Number(row[3]),
          quantity: Number(row[4]),
          storeId: row[5],
        };
      })
    : [];
};

export const convertWastes = async (
  values: string[][] | null | undefined
): Promise<Waste[]> => {
  return values
    ? values.map((row) => {
        return {
          id: row[0],
          date: row[1],
          productId: row[2],
          unitPrice: Number(row[3]),
          quantity: Number(row[4]),
          storeId: row[5],
        };
      })
    : [];
};

export const convertSyunToSales = async (
  salesData: Sales[],
  syunSalesData: SyunSales[],
  products: Product[],
  stores: Store[]
): Promise<Sales[]> => {
  const firstId: string = Math.max(
    ...salesData.map((item) => Number(item.id))
  ).toString();
  return syunSalesData.map((item, index) => {
    const productId: string =
      products.find((p) => p.name === item.productName)?.id || "";
    const storeId: string =
      stores.find((s) => s.name === item.storeName)?.id || "";
    return {
      id: (index + Number(firstId)).toString(),
      date: item.date,
      productId: productId,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      storeId: storeId,
    };
  });
};

export const convertSalesToBarChartData = async (
  salesData: Sales[]
): Promise<{ date: string; price: number }[]> => {
  const dates: string[] = [...new Set(salesData.map((item) => item.date))];

  return dates.map((date) => {
    const totalPrice: number = salesData
      .filter((item) => item.date === date)
      .reduce((prev, cur) => prev + cur.unitPrice * cur.quantity, 0);
    return { date: date, price: totalPrice };
  });
};

export const convertSalesToPieChartData = async (
  salesData: Sales[]
): Promise<{ productName: string; price: number; fill: string }[]> => {
  const productIds: string[] = [
    ...new Set(salesData.map((item) => item.productId)),
  ];

  const totalPriceData: { productName: string; totalPrice: number }[] =
    productIds.map((productId) => {
      const filteredSalesData: Sales[] = salesData.filter(
        (item) => item.productId === productId
      );
      const totalPrice: number = filteredSalesData.reduce(
        (prev, cur) => prev + cur.unitPrice * cur.quantity,
        0
      );
      return {
        productName: filteredSalesData[0]?.productName || "",
        totalPrice: totalPrice,
      };
    });

  const topFourData = totalPriceData
    .sort((a, b) => b.totalPrice - a.totalPrice)
    .slice(0, 4);

  const otherDataTotal = totalPriceData
    .slice(4)
    .reduce((sum, item) => sum + item.totalPrice, 0);

  const topFourWithColors: {
    productName: string;
    price: number;
    fill: string;
  }[] = topFourData.map((item, index) => ({
    productName: item.productName,
    price: item.totalPrice,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const pieChartData =
    otherDataTotal > 0
      ? [
          ...topFourWithColors,
          {
            productName: "その他",
            price: otherDataTotal,
            fill: "hsl(var(--chart-5))",
          },
        ]
      : topFourWithColors;

  return pieChartData;
};
