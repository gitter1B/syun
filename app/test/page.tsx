import { Shipment, ShipmentItem } from "@/lib/types";
import { OverflowMenu } from "../(main)/shipment/components/overflow-menu";
import { TestForm } from "./components/test-form";

export default async function TestPage() {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SPREADSHEET_ID}/values/出荷?key=${process.env.GOOGLE_SHEETS_API_KEY}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  const values: string[][] = data.values.slice(1);

  const shipments: Shipment[] = values.map((item) => {
    return {
      id: item[0],
      date: item[1],
      productId: item[2],
      unitPrice: Number(item[3]),
      quantity: Number(item[4]),
      storeId: item[5],
    };
  });

  console.log(shipments);

  return <div className="p-8 flex justify-center"></div>;
}
