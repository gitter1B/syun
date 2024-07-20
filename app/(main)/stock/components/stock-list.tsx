import { getAllSales } from "@/actions/sales";
import { getAllShipments } from "@/actions/shipment";
import { getAllStocks } from "@/actions/stock";
import { getAllWastes } from "@/actions/waste";
import { getSheets } from "@/lib/sheet";
import { Product, Sales, Shipment, Stock, Store, Waste } from "@/lib/types";
import { sheets_v4 } from "googleapis";
import { getAllProducts } from "@/actions/product";
import { getAllStores } from "@/actions/store";
import { StockAccordion } from "./stock-accordion";
import { StockCard } from "./stock-card";

export const StockList = async () => {
  const sheets: sheets_v4.Sheets = await getSheets();
  const shipments: Shipment[] = await getAllShipments(sheets);
  const salesData: Sales[] = await getAllSales(sheets);
  const wastes: Waste[] = await getAllWastes(sheets);
  const stocks: Stock[] = await getAllStocks(shipments, salesData, wastes);
  const products: Product[] = await getAllProducts(sheets);
  const stores: Store[] = await getAllStores(sheets);
  const existStoreIds: string[] = [
    ...new Set(stocks.map((item) => item.storeId)),
  ].sort((a, b) => Number(a) - Number(b));
  return (
    <div className="flex flex-col gap-2">
      {existStoreIds.map((storeId) => {
        const storeName: string =
          stores.find((s) => s.id === storeId)?.name || "";
        const filteredStocks: Stock[] = stocks.filter(
          (item) => item.quantity !== 0 && item.storeId === storeId
        );

        return (
          filteredStocks.length > 0 && (
            <StockAccordion
              key={storeId}
              storeId={storeId}
              storeName={storeName}
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {filteredStocks.map((item) => {
                  const productName: string =
                    products.find((p) => p.id === item.productId)?.name || "";
                  return (
                    <StockCard
                      key={item.id}
                      productName={productName}
                      stock={item}
                    />
                  );
                })}
              </div>
            </StockAccordion>
          )
        );
      })}
    </div>
  );
};
