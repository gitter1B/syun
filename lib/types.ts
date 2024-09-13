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
  producerId: string;
  date: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
  product?: Product;
  store?: Store;
};

export type ShipmentFilters = {
  producerId?: string;
  storeId?: string;
  date?: string;
};

export type Sales = {
  id: string;
  producerId: string;
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
  producerId?: string;
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
  producerId: string;
  date: string;
  storeName: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type Waste = {
  id: string;
  producerId: string;
  date: string;
  storeId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  store?: Store;
  product?: Product;
};

export type WasteFilters = {
  producerId?: string;
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

export type ProducerDTO = {
  id: string;
  name: string;
};

export type Producer = ProducerDTO & {
  password: string;
};

export type ProducerWithPassword = Producer & { password: string };

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
