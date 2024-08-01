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
  productName?: string;
  storeName?: string;
};

export type Sales = {
  id: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
  productName?: string;
  storeName?: string;
};

// export type SalesItem = Sales & {
//   productName: string;
// };

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
};

// export type SalesSearchParams = {
//   storeId: string;
//   year: string;
//   month: string;
//   page: string;
// };

// export type ShipmentItem = Shipment & {
//   storeName: string;
//   productName: string;
// };

export type Waste = {
  id: string;
  date: string;
  storeId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  storeName?: string;
  productName?: string;
};

// export type WasteItem = Waste & {
//   storeName: string;
//   productName: string;
// };

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
