import { Suspense } from "react";
import { DetailsContainer } from "./components/details-container";
import { DetailsDialog } from "./components/detais-dialog";
import { getToday } from "@/lib/date";

export default async function SalesDetailsDialogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today: string = await getToday();
  const from: string = (searchParams.from || today) as string;
  const to: string = (searchParams.to || today) as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const productId: string = (searchParams.productId || "all") as string;
  return (
    <DetailsDialog>
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>loading...</p>}>
        <DetailsContainer
          options={{
            from,
            to,
            storeId,
            productId,
          }}
        />
      </Suspense>
    </DetailsDialog>
  );
}
