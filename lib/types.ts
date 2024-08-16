export type User = {
  id: string;
  username: string;
  password: string;
};

export type Store = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
};

export type Shipment = {
  id: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
  product?: Product;
  store?: Store;
};

export type ShipmentFilters = {
  storeId: string;
  date: string;
};

export type Sales = {
  id: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  storeId: string;
  product?: Product;
  store?: Store;
};

export type SalesFilters = {
  storeId?: string;
  productId?: string;
  from?: string;
  to?: string;
};

export type TotalSales = {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalPrice: number;
};

export type SyunSales = {
  date: string;
  storeName: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type Waste = {
  id: string;
  date: string;
  storeId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  store?: Store;
  product?: Product;
};

export type WasteFilters = {
  storeId?: string;
  productId?: string;
};

export type Stock = {
  id: string;
  storeId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  productName?: string;
  storeName?: string;
};

// export type StockItem = Stock & {
//   productName: string;
// };

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type Item = {
  value: string;
  label: string;
};

export type Tables = { [key: string]: { header: string[]; data: string[][] } };
