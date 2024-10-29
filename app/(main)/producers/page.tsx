import Link from "next/link";

import { Producer } from "@/features/producers/lib/types";

import { getAllProducers } from "@/features/producers/lib/data";

export default async function SelectProducerPage() {
  const producers: Producer[] = await getAllProducers();
  return (
    <div className="flex flex-col gap-4">
      <h1>生産者を選択してください。</h1>
      <div className="grid grid-cols-3 gap-4">
        {producers.map((producer) => {
          return (
            <Link
              key={producer.id}
              href={`producers/${producer.id}/dashboard`}
              className="p-4 border rounded-sm shadow-md"
            >
              {producer.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
