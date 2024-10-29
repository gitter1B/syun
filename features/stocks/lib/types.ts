export type Stock = {
  id: string;
  storeId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  productName?: string;
  storeName?: string;
};
