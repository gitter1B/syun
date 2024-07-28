import { Product, Sales, Shipment, Store, SyunSales, Waste } from "./types";

export const convertProducts = async (
  values: string[][] | null | undefined
): Promise<Product[]> => {
  return values
    ? values.slice(1).map((row) => {
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
    ? values.slice(1).map((row) => {
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
    ? values.slice(1).map((row) => {
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
    ? values.slice(1).map((row) => {
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
    ? values.slice(1).map((row) => {
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
  return [];
};
