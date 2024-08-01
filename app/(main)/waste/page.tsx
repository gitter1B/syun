import { Suspense } from "react";
import { WasteFilter } from "./components/waste-filter";
import { WasteList } from "./components/waste-list";

export default async function WastePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex flex-col gap-4">
      <WasteFilter />
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>loading...</p>}>
        <WasteList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
