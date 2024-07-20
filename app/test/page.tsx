import { Button } from "@/components/ui/button";
import { convertSales, convertShipments, convertWastes } from "./actions";

export default async function TestPage() {
  return (
    <div className="flex justify-center items-center h-dvh">
      <form
        action={async () => {
          "use server";
          // await convertWastes();
          // await convertShipments();
          // await convertSales();
        }}
      >
        <Button type="submit">テスト</Button>
      </form>
    </div>
  );
}
