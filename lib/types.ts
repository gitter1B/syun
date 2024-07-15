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
};

export type Sales = {
  id: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
};

export type TotalSales = {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalPrice: number;
};

export type SalesSearchParams = {
  storeId: string;
  year: string;
  month: string;
  page: string;
};

export type ShipmentItem = Shipment & {
  productName: string;
  storeName: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};
