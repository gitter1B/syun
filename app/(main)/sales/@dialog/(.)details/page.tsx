import { Suspense } from "react";
import { DetailsContainer } from "./components/details-container";
import { DetailsDialog } from "./components/detais-dialog";

export default async function SalesDetailsDialogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DetailsDialog>
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>loading...</p>}>
        <DetailsContainer searchParams={searchParams} />
      </Suspense>
    </DetailsDialog>
  );
}
