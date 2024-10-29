import { SideSheet } from "@/components/layout/side-sheet";
import { Suspense } from "react";
import { ProducersContainer } from "@/features/producers/components/producer-container";
import { ProducerSKeleton } from "@/features/producers/components/producer-skeleton";

export const Header = async () => {
  return (
    <header className="min-h-16 border-b flex items-center justify-between gap-2 px-4 py-2 md:px-8">
      <span className="min-w-56 hidden lg:block">LOGO</span>
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <SideSheet />
        </div>
      </div>
      <Suspense fallback={<ProducerSKeleton />}>
        <ProducersContainer />
      </Suspense>
    </header>
  );
};
