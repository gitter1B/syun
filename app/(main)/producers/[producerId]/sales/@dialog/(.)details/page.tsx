import { Suspense } from "react";
import { DetailsContainer } from "./components/details-container";
import { DetailsDialog } from "./components/detais-dialog";
import { getToday } from "@/lib/date";
import { SalesFilters } from "@/lib/types";

export default async function SalesDetailsDialogPage({
  params,
  searchParams,
}: {
  params: { producerId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today: string = await getToday();
  const producerId: string = params.producerId;
  const from: string = (searchParams.from || today) as string;
  const to: string = (searchParams.to || today) as string;
  const storeId: string = (searchParams.storeId || "all") as string;
  const productId: string = (searchParams.productId || "all") as string;
  const filters: SalesFilters = {
    producerId,
    from,
    to,
    storeId,
    productId,
  };
  return (
    <DetailsDialog>
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>loading...</p>}>
        <DetailsContainer filters={filters} />
      </Suspense>
    </DetailsDialog>
  );
}
